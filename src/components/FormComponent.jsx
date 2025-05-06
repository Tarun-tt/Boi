import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Hindi.css";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "http://192.168.60.60:8080/o/hindi";
const API_URL_COMMON = "http://192.168.60.60:8080/";
const headers = {};

// const API_URL = "/o/hindi";
// const API_URL_COMMON = "/";
// const csrfToken = window?.Liferay?.authToken || "";
// const headers = {
//     "Content-Type": "application/json",
//     "x-csrf-token": csrfToken,
// };

function FormComponent({ mode }) {
    const getPreviousQuarterLastDate = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentQuarter = Math.floor(currentMonth / 3);
        let year = now.getFullYear();
        let lastMonthOfPrevQuarter;
        if (currentQuarter === 0) {
            lastMonthOfPrevQuarter = 11; // December
            year -= 1;
        } else {
            lastMonthOfPrevQuarter = currentQuarter * 3 - 1;
        }
        return new Date(year, lastMonthOfPrevQuarter + 1, 0);
    };

    const previousQuarterHindi = () => {
        const prevQuarterDate = getPreviousQuarterLastDate();
        const day = prevQuarterDate.getDate();
        const month = new Intl.DateTimeFormat("hi-IN", {
            month: "long",
        }).format(prevQuarterDate);
        const str = `${day} ${month}`;
        return str;
    };

    const previousFinancialYear = () => {
        const prevQuarterDate = getPreviousQuarterLastDate();
        const year = new Intl.DateTimeFormat("hi-IN", {
            year: "numeric",
        }).format(prevQuarterDate);
        const str = `${year}`;
        return str;
    };

    const [form, setForm] = useState({
        qtr: previousQuarterHindi(),
        year: previousFinancialYear(),
        zone: "",
        branch: "",
        nameAddress: "",
        bhashaiKshetra: "",
        stdCode: "",
        phoneNo: "",
        email: "",
        noTotal: "",
        noTotalSecond: "",
        englishPaper: "",
        totalHindiIssuedNumber: "",
        hindiPaper: "",
        hindiAns: "",
        engAns: "",
        notAns: "",
        countFromA: "",
        hindiAnsA: "",
        engAnsA: "",
        notAnsA: "",
        countFromB: "",
        hindiAnsB: "",
        engAnsB: "",
        notAnsB: "",
        hindiFromA: "",
        engFromA: "",
        totalFromA: "",
        hindiFromB: "",
        engFromB: "",
        totalFromB: "",
        hindiFromC: "",
        engFromC: "",
        totalFromC: "",
        hindiComment: "",
        engComment: "",
        totalComment: "",
        labCount: "",
        officers: "",
        workers: "",
        dateRajbhasha: "",
        commeteeNum: "",
        meetingCountDuringCurrentQtr: "",
        hindiIssued: "",
        passbookA: "",
        hindiLoan: "",
        allFormsDualLanguage: "",
        mainTask: "",
        signature: "",
        memberName: "",
        designation: "",
        stdCode_: "",
        faxNumber: "",
        emailA: "",
        authorName: "",
        createdOn: "",
    });
    console.log("formformformformform", form);

    const [orgOptions, setOrgOptions] = useState([]);
    const [branchOptions, setBranchOptions] = useState([]);
    const [areaOptions, setAreaOptions] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formName, setFormName] = useState("");

    const getPreviousQuarterLastMonthName = () => {
        const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
        const currentQuarter = Math.floor(month / 3); // 0 to 3
        const previousQuarter = (currentQuarter + 3) % 4; // handles wrap-around to previous year
        const prevQuarterEndMonthIndex = (previousQuarter + 1) * 3 - 1;
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        return monthNames[prevQuarterEndMonthIndex];
    };

    useEffect(() => {
        // setOrgOptions(['Option 1', 'Option 2']);
        // setBranchOptions(['Branch 1', 'Branch 2']);
        axios
            .get(`${API_URL_COMMON}o/commonApi/hindiZone`, {
                headers,
                responseType: "json",
            })
            .then((res) => {
                const zones = res.data || [];
                const zoneList = zones
                    .filter((item) => item.zoneInHindi)
                    .map((item) => item.zoneInHindi.trim());

                console.log("Parsed Hindi Zones:", zoneList);
                setOrgOptions(zoneList);
                // console.log("Zone List:", res?.data?.zoneInHindi);
                // setOrgOptions(res?.data?.zoneInHindi || []);
            })
            .catch((err) => console.error("Zone Fetch Error:", err));

        if (form.zone) {
            axios
                .post(
                    `${API_URL_COMMON}o/commonApi/branchCode`,
                    {
                        zoneInHindi: form.zone,
                    },
                    { headers }
                )
                .then((res) => {
                    console.log("Branch List:", res);
                    setBranchOptions(res.data || []);
                })
                .catch((err) => console.error("Branch Fetch Error:", err));
        }

        setAreaOptions(["क", "ख", "ग"]);
        if ((mode === "edit" || mode === "view") && id) {
            axios.get(`${API_URL}/${id}`, { headers }).then((res) => {
                setForm(res.data);
                if (res.data.zone) {
                    axios
                        .post(
                            `${API_URL_COMMON}o/commonApi/branchCode`,
                            {
                                zoneInHindi: res.data.zone,
                            },
                            { headers }
                        )
                        .then((res2) => {
                            setBranchOptions(res2.data || []);
                        });
                }
            });
        }

        const monthName = getPreviousQuarterLastMonthName();
        const formN =
            monthName === "March"
                ? `Hindi QPR Branch ${monthName} Part 1`
                : `Hindi QPR Branch ${monthName}`;
        setFormName(formN);
    }, [mode, id]);

    // const handleChange = (e) => {
    //   const { name, value } = e.target;
    //   setForm((prev) => ({ ...prev, [name]: value }));
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // if zone changes, fetch branches
        if (name === "zone") {
            setForm((prev) => ({ ...prev, branch: "" }));
            axios
                .post(
                    `${API_URL_COMMON}o/commonApi/branchCode`,
                    {
                        zoneInHindi: value,
                    },
                    { headers }
                )
                .then((res) => {
                    setBranchOptions(res.data || []);
                })
                .catch((err) => console.error("Branch Fetch Error:", err));
        }
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (mode === "edit" && id) {
    //         axios
    //             .put(`${API_URL}/${id}`, form, { headers })
    //             .then(() => navigate("/hindi-qpr-branch-1"))
    //             .catch((err) => console.error("Update Error:", err));
    //     } else {
    //         axios
    //             .post(`${API_URL}/add`, form, { headers })
    //             .then(() => navigate("/hindi-qpr-branch-1"))
    //             .catch((err) => console.error("Add Error:", err));
    //     }
    // };
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        const request =
            mode === "edit" && id
                ? axios.put(`${API_URL}/${id}`, form, { headers })
                : axios.post(`${API_URL}/add`, form, { headers });

        request
            .then(() => navigate("/hindi-qpr-branch-1"))
            .catch((err) => {
                if (err && err.status === 409) {
                    const duplicateRRN = err?.response?.data
                        .split("Duplicate entry ")[1]
                        .split(" for key ")[0];
                    const msg = `Data already present please edit the existing records if you have rights ${duplicateRRN}`;
                    const confirmRoute = window.confirm(msg);
                    if (!confirmRoute) return;
                    navigate("/hindi-qpr-branch-1");
                }
                console.error("Submit Error:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="container mt-4">
            <h3 style={{ color: "#00dcff" }}>{formName}</h3>
            <label>
                <span style={{ color: "red" }}>*</span>Indicated required fields
            </label>
            <h4>
                <span>*</span>सरकारी क्षेत्र के बैंकों एवं वित्तीय संस्थाओं में
                राजभाषा हिंदी के प्रगामी प्रयोग से संबंधित तिमाही प्रगति रिपोर्ट
            </h4>
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col-md-3"></div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>
                                तिमाही <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="qtr"
                                value={form.qtr}
                                onChange={handleChange}
                                // disabled={mode === 'view'}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="form-group">
                            <label>
                                साल <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="year"
                                value={form.year}
                                onChange={handleChange}
                                // disabled={mode === 'view'}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label>को समाप्त तिमाही</label>
                    </div>
                </div>
                <h5>भाग - I (प्रत्येक तिमाही में भरा जाए)</h5>

                <div className="row mb-3">
                    <div className="col-md-4">
                        <div className="form-group mb-3">
                            <label>
                                शाखा/कार्यालय का नाम--बैंक ऑफ इंडिया -1
                            </label>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group mb-3">
                            <label>
                                अंचल <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                                className="form-control"
                                name="zone"
                                value={form.zone || ""}
                                onChange={handleChange}
                                disabled={mode !== "add"}
                                required
                            >
                                <option value="">Choose an Option</option>
                                {orgOptions.map((opt, i) => (
                                    <option key={i} value={opt.trim()}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group mb-3">
                            <label>
                                शाखा <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                                className="form-control"
                                name="branch"
                                value={form.branch || ""}
                                onChange={handleChange}
                                disabled={mode !== "add"}
                                required
                            >
                                <option value="">Choose an Option</option>
                                {branchOptions.map((opt, i) => (
                                    // <option key={i} value={opt}>{opt}</option>\
                                    <option key={i} value={opt.branchCode}>
                                        {opt.branchCode}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="form-group mb-3 col-md-8">
                        <label>बैंक/वित्तीय संस्था का नाम औरपूरा पता</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nameAddress"
                            value={form.nameAddress}
                            onChange={handleChange}
                            disabled={mode === "view"}
                        />
                    </div>

                    <div className="form-group mb-3 col-md-4">
                        <label>भाषाई क्षेत्र</label>
                        <select
                            className="form-control"
                            name="bhashaiKshetra"
                            value={form.bhashaiKshetra}
                            onChange={handleChange}
                            disabled={mode === "view"}
                        >
                            <option value="">Choose an Option</option>
                            {areaOptions.map((opt, i) => (
                                <option key={i} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group mb-3">
                    <label>संविधिक राजभाषा अधिकारी का फोन नंबर</label>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>एस.टी.डी कोड</label>
                            <input
                                type="text"
                                className="form-control"
                                name="stdCode"
                                value={form.stdCode}
                                onChange={handleChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(
                                        /[^\d]/g,
                                        ""
                                    ); // Only digits
                                }}
                                maxLength={5}
                                disabled={mode === "view"}
                                pattern="^\d{3,5}$"
                                title="3 से 5 अंकों का वैध एस.टी.डी कोड दर्ज करें"
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">
                            <label>फोन नं.</label>
                            <input
                                type="text"
                                className="form-control"
                                name="phoneNo"
                                value={form.phoneNo}
                                onChange={handleChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(
                                        /[^\d]/g,
                                        ""
                                    );
                                }}
                                maxLength={10}
                                disabled={mode === "view"}
                                pattern="^[6-9]\d{9}$"
                                title="10 अंकों का मोबाइल नंबर दर्ज करें जो 6, 7, 8 या 9 से शुरू होता है"
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">
                            <label>ई-मेल</label>
                            <input
                                type="text"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                disabled={mode === "view"}
                                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                placeholder="वैध ई-मेल दर्ज करें (उदा: example@domain.com)"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group mb-3">
                    <label>
                        1. राजभाषा अधिनियम 1963 की धारा 3(3) के अंतर्गत जारी
                        कागजात*
                    </label>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>(क) जारी कागजात की कुल संख्या</label>
                            <input
                                type="text"
                                className="form-control"
                                name="noTotal"
                                value={form.noTotal}
                                onChange={handleChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 15);
                                }}
                                pattern="^\d{1,15}$"
                                title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                                disabled={mode === "view"}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>
                                (ख) द्विभाषी रूप में जारी कागज़ात की संख्‍या
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="noTotalSecond"
                                value={form.noTotalSecond}
                                onChange={handleChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 15);
                                }}
                                pattern="^\d{1,15}$"
                                title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                                disabled={mode === "view"}
                            />
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>
                                (ग) केवल अंग्रेजी में जारी किये गये कागजात
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="englishPaper"
                                value={form.englishPaper}
                                onChange={handleChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 15);
                                }}
                                pattern="^\d{1,15}$"
                                title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                                disabled={mode === "view"}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>
                                (घ) केवल हिंदी में जारी किये गये कागजात
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="totalHindiIssuedNumber"
                                value={form.totalHindiIssuedNumber}
                                onChange={handleChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 15);
                                }}
                                pattern="^\d{1,15}$"
                                title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                                disabled={mode === "view"}
                            />
                        </div>
                    </div>
                    <label className="mt-3">
                        *इनमें सामान्य आदेश, ज्ञापन, संकल्प, अधिसूचनाएं, नियम,
                        करार, संविदा, टेंडर नोटिस,संसदीय प्रश्न, आदि शामिल हैं।
                    </label>
                </div>

                <div className="form-group mb-3">
                    <label>2.हिंदी में प्राप्त पत्र (राजभाषा नियम - 5)</label>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>
                                (क) हिंदी में प्राप्त कुल पत्रों की संख्या
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="hindiPaper"
                                value={form.hindiPaper}
                                onChange={handleChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 15);
                                }}
                                pattern="^\d{1,15}$"
                                title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                                disabled={mode === "view"}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>
                                (ख) द्विभाषी रूप में जारी कागज़ात की संख्‍या
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="hindiAns"
                                value={form.hindiAns}
                                onChange={handleChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 15);
                                }}
                                pattern="^\d{1,15}$"
                                title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                                disabled={mode === "view"}
                            />
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>
                                (ग) इनमें से कितनों के उत्तर अंग्रेजी में दिए गए
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="engAns"
                                value={form.engAns}
                                onChange={handleChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 15);
                                }}
                                pattern="^\d{1,15}$"
                                title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                                disabled={mode === "view"}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>
                                (घ) इनमें से कितनों के उत्तर दिए जाने अपेक्षित
                                नहीं थे
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="notAns"
                                value={form.notAns}
                                onChange={handleChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 15);
                                }}
                                pattern="^\d{1,15}$"
                                title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                                disabled={mode === "view"}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group mb-3">
                    <label>
                        3. अंग्रेजी में प्राप्त पत्रों के उत्तर हिंदी में दिए
                        जाने की स्थिति (केवल ‘क’ और ‘ख’ क्षेत्रों में स्थित
                        कार्यालयों के लिए)
                    </label>
                </div>
                <div className="row mb-3">
                    <label className="col-md-4"></label>
                    <label className="col-md-2">
                        अंग्रेजी में प्राप्त पत्रों की संख्या
                    </label>
                    <label className="col-md-2">
                        इनमें से कितनों के उत्तर हिंदी में दिए गए
                    </label>
                    <label className="col-md-2">
                        इनमें से कितनों के उत्तर अंग्रेजी में दिए
                    </label>

                    <label className="col-md-2">
                        इनमें से कितनों के उत्तर अपेक्षित नहीं थे
                    </label>
                </div>
                <div className="row mb-3">
                    <label className="col-md-4">क’क्षेत्र</label>
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            name="countFromA"
                            value={form.countFromA}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            name="hindiAnsA"
                            value={form.hindiAnsA}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            name="engAnsA"
                            value={form.engAnsA}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            name="notAnsA"
                            value={form.notAnsA}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-md-4">ख’क्षेत्र </label>
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            name="countFromB"
                            value={form.countFromB}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            name="hindiAnsB"
                            value={form.hindiAnsB}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            name="engAnsB"
                            value={form.engAnsB}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                    <div className="col-md-2">
                        <input
                            type="text"
                            className="form-control"
                            name="notAnsB"
                            value={form.notAnsB}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                </div>

                <div className="form-group mb-3">
                    <label>4.भेजे गये मूल पत्रों का ब्यौरा</label>
                </div>
                <div className="row mb-3">
                    <label className="col-md-3"></label>
                    <label className="col-md-3"> हिंदी में</label>
                    <label className="col-md-3">अंग्रेजी में</label>
                    <label className="col-md-3">
                        {" "}
                        भेजे गए पत्रों की कुल संख्या
                    </label>
                </div>
                <div className="row mb-3">
                    <label className="col-md-3">क’क्षेत्र</label>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            name="hindiFromA"
                            value={form.hindiFromA}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            name="engFromA"
                            value={form.engFromA}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            name="totalFromA"
                            value={form.totalFromA}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-md-3">ख’क्षेत्र </label>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            name="hindiFromB"
                            value={form.hindiFromB}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            name="engFromB"
                            value={form.engFromB}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            name="totalFromB"
                            value={form.totalFromB}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-md-3">ग’क्षेत्र </label>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            name="hindiFromC"
                            value={form.hindiFromC}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            name="engFromC"
                            value={form.engFromC}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            name="totalFromC"
                            value={form.totalFromC}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                </div>

                <div className="form-group mb-3">
                    <label>
                        5. (तिमाही के दौरान) फाइलों /दस्तावेजों पर हिंदी में
                        लिखी गई टिप्पणियॉं
                    </label>
                </div>

                <div className="row mb-3">
                    <label className="col-md-3">
                        हिंदी में लिखी गई टिप्‍पणियों के पृष्‍ठों की संख्‍या
                    </label>
                    <div className="col-md-9">
                        <input
                            type="text"
                            className="form-control"
                            name="hindiComment"
                            value={form.hindiComment}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-md-3">
                        अंग्रेजी में लिखी गई टिप्‍पणियों के पृष्‍ठों की संख्‍या
                    </label>
                    <div className="col-md-9">
                        <input
                            type="text"
                            className="form-control"
                            name="engComment"
                            value={form.engComment}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-md-3">
                        कुल टिप्‍पणियों के पृष्‍ठों की संख्‍या
                    </label>
                    <div className="col-md-9">
                        <input
                            type="text"
                            className="form-control"
                            name="totalComment"
                            value={form.totalComment}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-md-6">
                        पृष्‍ठों की संख्‍या की गणना पूर्ण अंक एवं आधा अंक में ही
                        की जाए ।
                    </label>
                    <div className="col-md-6"></div>
                </div>
                <div className="form-group mb-3">
                    <label>6. हिंदी कार्यशालाएं</label>
                </div>
                <div className="row mb-3">
                    <label className="col-md-4">
                        तिमाही के दौरान पूर्ण दिवसीय आयोजित कार्यशालाओं की
                        संख्‍या
                    </label>
                    <div className="col-md-8">
                        <input
                            type="text"
                            className="form-control"
                            name="labCount"
                            value={form.labCount}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-md-4">
                        तिमाही के दौरान पूर्ण दिवसीय आयोजित कार्यशालाओं की
                        संख्‍या
                    </label>
                    <label className="col-md-4">अधिकारी</label>
                    <label className="col-md-4">कर्मचारी</label>
                </div>
                <div className="row mb-3">
                    <label className="col-md-4"></label>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            name="officers"
                            value={form.officers}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            name="workers"
                            value={form.workers}
                            onChange={handleChange}
                            onInput={(e) => {
                                e.target.value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 15);
                            }}
                            pattern="^\d{1,15}$"
                            title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                            disabled={mode === "view"}
                        />
                    </div>
                </div>
                <label>
                    {" "}
                    नोट : कार्यालय के समस्‍त कार्मिकों को 2 वर्ष में कम से कम एक
                    बार प्रशिक्षित किया जाना आवश्‍यक है।
                </label>
                <div className="form-group mb-3 container">
                    <label>
                        7. विभागीय/संगठनीय राजभाषा कार्यान्‍वयन समिति की बैठक के
                        आयोजन की तिथि
                    </label>
                    <div className="row mb-3">
                        <label className="col-md-6">
                            (क) राजभाषा कार्यान्वयन समिति की बैठक की तिथि
                            (केंद्रीय/प्रधान कार्यालय की)
                        </label>
                        <label className="col-md-6">
                            (ख) अधीनस्थ कार्यालयों में गठित राजभाषा का.समितियों
                            की संख्या
                        </label>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <input
                                type="date"
                                className="form-control"
                                name="dateRajbhasha"
                                value={form.dateRajbhasha}
                                onChange={handleChange}
                                disabled={mode === "view"}
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                name="commeteeNum"
                                value={form.commeteeNum}
                                onChange={handleChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 15);
                                }}
                                pattern="^\d{1,15}$"
                                title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                                disabled={mode === "view"}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-md-6">
                            (ग) इस तिमाही में आयोजित बैठकों की संख्या
                        </label>
                        <label className="col-md-6">
                            (घ) बैठकों से संबंधित कार्यसूची और कार्यवृत्त क्या
                            हिंदी में जारी किये गये
                        </label>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                name="meetingCountDuringCurrentQtr"
                                value={form.meetingCountDuringCurrentQtr}
                                onChange={handleChange}
                                onInput={(e) => {
                                    e.target.value = e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 15);
                                }}
                                pattern="^\d{1,15}$"
                                title="केवल 1 से 15 अंकों की संख्या दर्ज करें"
                                disabled={mode === "view"}
                            />
                        </div>
                        <div className="col-md-6">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="hindiIssued"
                                    id="engLettersYes"
                                    value="yes"
                                    checked={form.hindiIssued === "yes"}
                                    onChange={handleChange}
                                    disabled={mode === "view"}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="engLettersYes"
                                >
                                    {" "}
                                    हाँ
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="hindiIssued"
                                    id="engLettersNo"
                                    value="no"
                                    checked={form.hindiIssued === "no"}
                                    onChange={handleChange}
                                    disabled={mode === "view"}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="engLettersNo"
                                >
                                    नहीं
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-group mb-3 container">
                    <label>8. कामकाज में हिंदी का प्रयोग</label>
                    <div className="row mb-3">
                        <label className="col-md-6">
                            (i) पासबुक हिंदी में भरने (नाम,पता,जमा,डेबिट आदि) की
                            सुविधा उपलब्‍ध है ?
                        </label>
                        <div className="col-md-6">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="passbookA"
                                    id="engLettersYes"
                                    value="yes"
                                    checked={form.passbookA === "yes"}
                                    onChange={handleChange}
                                    disabled={mode === "view"}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="engLettersYes"
                                >
                                    {" "}
                                    हाँ
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="passbookA"
                                    id="engLettersNo"
                                    value="no"
                                    checked={form.passbookA === "no"}
                                    onChange={handleChange}
                                    disabled={mode === "view"}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="engLettersNo"
                                >
                                    नहीं
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-md-6">
                            (ii) ऋण वसूली पत्र हिंदी में जारी किए जाते हैं ?
                        </label>
                        <div className="col-md-6">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="hindiLoan"
                                    id="engLettersYes"
                                    value="yes"
                                    checked={form.hindiLoan === "yes"}
                                    onChange={handleChange}
                                    disabled={mode === "view"}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="engLettersYes"
                                >
                                    {" "}
                                    हाँ
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="hindiLoan"
                                    id="engLettersNo"
                                    value="no"
                                    checked={form.hindiLoan === "no"}
                                    onChange={handleChange}
                                    disabled={mode === "view"}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="engLettersNo"
                                >
                                    नहीं
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-md-6">
                            (iii) सारे फार्म(वाउचर/ड्राफ्ट/जमा रसीदें इत्‍यादि)
                            द्विभाषी हैं?
                        </label>
                        <div className="col-md-6">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="allFormsDualLanguage"
                                    id="engLettersYes"
                                    value="yes"
                                    checked={
                                        form.allFormsDualLanguage === "yes"
                                    }
                                    onChange={handleChange}
                                    disabled={mode === "view"}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="engLettersYes"
                                >
                                    {" "}
                                    हाँ
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="allFormsDualLanguage"
                                    id="engLettersNo"
                                    value="no"
                                    checked={form.allFormsDualLanguage === "no"}
                                    onChange={handleChange}
                                    disabled={mode === "view"}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="engLettersNo"
                                >
                                    नहीं
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-md-6">
                            9. तिमाही में किए गए उल्लेखनीय कार्य/उपलब्धियों का
                            संक्षिप्त विवरण (अधिकतम 250 कैरेक्टर)
                        </label>
                        <div className="col-md-6"> </div>
                        <div className="col-md-12">
                            <textarea
                                className="form-control"
                                name="mainTask"
                                value={form.mainTask}
                                onChange={handleChange}
                                disabled={mode === "view"}
                                maxLength={250}
                                rows={4}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group mb-3">
                    <label>
                        उल्लिखित सूचना उपलब्ध अभिलेखों के आधार पर बनाई गई है तथा
                        मेरी जानकारी के अनुसार सही है |
                    </label>
                </div>
                <div className="row mb-3">
                    <div className="col-md-4"></div>
                    <label className="col-md-4">
                        बैंक की राजभाषा कार्यान्वयन समिति के अध्यक्ष के
                        हस्ताक्षर
                    </label>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            name="signature"
                            value={form.signature}
                            onChange={handleChange}
                            disabled={mode === "view"}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4"></div>
                    <label className="col-md-4">अध्यक्ष का नाम</label>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            name="memberName"
                            value={form.memberName}
                            onChange={handleChange}
                            disabled={mode === "view"}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4"></div>
                    <label className="col-md-4">पदनाम</label>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            name="designation"
                            value={form.designation}
                            onChange={handleChange}
                            disabled={mode === "view"}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4"></div>
                    <label className="col-md-4">
                        एसटीडी कोड सहित फोन नम्बर
                    </label>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            name="stdCode_"
                            value={form.stdCode_}
                            onChange={handleChange}
                            disabled={mode === "view"}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                    /[^\d\-]/g,
                                    ""
                                );
                            }}
                            maxLength={13} // Max: 5 (STD) + 1 (dash) + 8 (number)
                            pattern="^[0][1-9]{2,4}-[0-9]{6,8}$"
                            title="मान्य STD कोड और फ़ोन नंबर दर्ज करें जैसे 011-23456789"
                            placeholder="मान्य STD कोड और फ़ोन नंबर दर्ज करें जैसे 011-23456789"
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4"></div>
                    <label className="col-md-4">फैक्स नम्बर</label>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            name="faxNumber"
                            value={form.faxNumber}
                            onChange={handleChange}
                            disabled={mode === "view"}
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                    /[^\d]/g,
                                    ""
                                );
                            }}
                            maxLength={10}
                            pattern="^[2-9]\d{9}$"
                            title="10 अंकों का फ़ैक्स नंबर दर्ज करें जो 2 से 9 के बीच के अंक से शुरू होता है"
                            placeholder="10 अंकों का फ़ैक्स नंबर दर्ज करें जो 2 से 9 के बीच के अंक से शुरू होता है"
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4"></div>
                    <label className="col-md-4">ई-मेल का पता</label>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            name="emailA"
                            value={form.emailA}
                            onChange={handleChange}
                            disabled={mode === "view"}
                            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                            placeholder="वैध ई-मेल दर्ज करें (उदा: example@domain.com)"
                        />
                    </div>
                </div>
                <label>
                    नोट: कोई भी कॉलम खाली न छोड़ा जाए और सूचना स्पष्ट रूप से दी
                    जाए।
                </label>
                <div className="button-group mt-3">
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => navigate("/hindi-qpr-branch-1")}
                    >
                        Cancel
                    </button>
                    {/* {mode !== "view" && (
                        <button className="btn btn-primary" type="submit">
                            {mode === "add" ? "Submit" : "Update"}
                        </button>
                    )} */}
                    {mode !== "view" && (
                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? mode === "add"
                                    ? "Submitting..."
                                    : "Updating..."
                                : mode === "add"
                                ? "Submit"
                                : "Update"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default FormComponent;
