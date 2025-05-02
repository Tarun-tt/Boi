import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";

const API_URL = "http://192.168.60.60:8080/o/hindi";
// const API_URL = "http://192.168.60.60:8080/o/student";
// const API_URL = "http://192.168.60.60:8080/o/hindi";
const headers = {};

// const API_URL = '/o/student';
// const csrfToken = window?.Liferay?.authToken || "";
// const headers = {
//     "Content-Type": "application/json",
//     "x-csrf-token": csrfToken,
// };

const headerJSON = [
    "Sr. No.",
    "Record Ref. No.",
    "तिमाही",
    "साल",
    "अंचल",
    "शाखा",
    "बैंक/वित्तीय संस्था का नाम औरपूरा पता",
    "भाषाई क्षेत्र",
    "एस.टी.डी कोड",
    "फोन नं.",
    "ई-मेल",
    "(क) जारी कागजात की कुल संख्या",
    "(ख) द्विभाषी रूप में जारी कागज़ात की संख्‍या",
    "(ग) केवल अंग्रेजी में जारी किये गये कागजात",
    "(घ) केवल हिंदी में जारी किये गये कागजात",
    "(क) हिंदी में प्राप्त कुल पत्रों की संख्या",
    "(ख) इनमें से कितनों के उत्तर हिन्दी में दिए गए",
    "(ग) इनमें से कितनों के उत्तर अंग्रेजी में दिए गए",
    "(घ) इनमें से कितनों के उत्तर दिए जाने अपेक्षित नहीं थे",
    "‘क’क्षेत्र से अंग्रेजी में प्राप्त पत्रों की संख्या",
    "‘क’क्षेत्र से इनमें से कितनों के उत्तर हिंदी में दिए गए",
    "‘क’क्षेत्र से इनमें से कितनों के उत्तर अंग्रेजी में दिए",
    "‘क’क्षेत्र से इनमें से कितनों के उत्तर अपेक्षित नहीं थे",
    "‘ख’क्षेत्र से अंग्रेजी में प्राप्त पत्रों की संख्या",
    "‘ख’क्षेत्र से इनमें से कितनों के उत्तर हिंदी में दिए गए",
    "‘ख’क्षेत्र से इनमें से कितनों के उत्तर अंग्रेजी में दिए",
    "‘ख’क्षेत्र से इनमें से कितनों के उत्तर अपेक्षित नहीं थे",
    "‘क’क्षेत्र से हिंदी में",
    "‘क’क्षेत्र से अंग्रेजी में",
    "‘क’क्षेत्र से भेजे गए पत्रों की कुल संख्या",
    "‘ख’क्षेत्र से हिंदी में",
    "‘ख’क्षेत्र से अंग्रेजी में",
    "‘ख’क्षेत्र से भेजे गए पत्रों की कुल संख्या",
    "‘ग’क्षेत्र को हिंदी में",
    "‘ग’क्षेत्र को अंग्रेजी में",
    "‘ग’क्षेत्र को भेजे गए पत्रों की कुल संख्या",
    "हिंदी में लिखी गई टिप्‍पणियों के पृष्‍ठों की संख्‍या",
    "अंग्रेजी में लिखी गई टिप्‍पणियों के पृष्‍ठों की संख्‍या",
    "कुल टिप्‍पणियों के पृष्‍ठों  की संख्‍या",
    "तिमाही के दौरान पूर्ण दिवसीय आयोजित कार्यशालाओं की संख्‍या",
    "अधिकारी",
    "कर्मचारी",
    "(क) राजभाषा कार्यान्वयन समिति की बैठक की तिथि (केंद्रीय/प्रधान कार्यालय की)",
    "(ख) अधीनस्थ कार्यालयों में गठित राजभाषा का.समितियों की संख्या",
    "(ग) इस तिमाही में आयोजित बैठकों की संख्या",
    "(घ) बैठकों से संबंधित कार्यसूची और कार्यवृत्त क्या हिंदी में जारी किये गये",
    "(i) पासबुक हिंदी में भरने (नाम,पता,जमा,डेबिट आदि) की सुविधा उपलब्‍ध है ?",
    "(ii) ऋण वसूली पत्र हिंदी में जारी किए जाते हैं ?",
    "(iii) सारे फार्म(वाउचर/ड्राफ्ट/जमा रसीदें इत्‍यादि) द्विभाषी हैं?",
    "9. तिमाही में किए गए उल्लेखनीय कार्य/उपलब्धियों का संक्षिप्त विवरण (अधिकतम 250 कैरेक्टर)",
    "बैंक की राजभाषा कार्यान्वयन समिति के अध्यक्ष के हस्ताक्षर",
    "अध्यक्ष का नाम",
    "पदनाम",
    "एसटीडी कोड सहित फोन नम्बर",
    "फैक्स नम्बर",
    "ई-मेल का पता",
    "Author Name",
    "Created On",
    "Actions",
];
function TableComponent() {
    const [users, setUsers] = useState([]);
    const [deleteShow, setDeleteShow] = useState(false);
    const navigate = useNavigate();
    // const [filterOptions, setFilterOptions] = useState([]);
    const [filterOptions, setFilterOptions] = useState({
        columnName: "",
        columnValue: "",
    });
    const [totalCount, setTotalCount] = useState(0);
    const [orgOptions, setOrgOptions] = useState([]);
    const [hasAddRight, setHasAddRight] = useState(false);
    const [hasEditRight, sethasEditRight] = useState(false);
    const [hasDeleteRight, setHasDeleteRight] = useState(false);
    const [hasViewRight, setHasViewRight] = useState(false);
    const [hasExportExcel, sethasExportExcel] = useState(false);

    const [filterParams, setFilterParams] = useState({
        columnName: "rrn_",
        columnValue: "",
        pageNumber: 1,
        pageSize: 10,
    });
    // const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [form, setForm] = useState({
        zone: "",
    });
    useEffect(() => {
        axios
            .post(`${API_URL}/records`, filterParams, { headers })
            .then((res) => {
                console.log("resresresresresresresres", res);
                setTotalCount(res?.data?.count);
                setCurrentPage(res?.data?.pageNumber || 1);
                setFilterParams((prev) => ({
                    ...prev,
                    pageSize: res?.data?.pageSize || 10,
                    pageNumber: res?.data?.pageNumber || 1,
                }));
                const mappedUsers = res?.data?.data?.map((user) => ({
                    recordId: user.recordId,
                    allFormsDualLanguage: user.allFormsDualLanguage,
                    authorName: user.authorName,
                    bhashaiKshetra: user.bhashaiKshetra,
                    branch: user.branch,
                    commeteeNum: user.commeteeNum,
                    countFromA: user.countFromA,
                    countFromB: user.countFromB,
                    createdBy: user.createdBy,
                    createdOn: user.createdOn,
                    dateRajbhasha: user.dateRajbhasha,
                    designation: user.designation,
                    email: user.email,
                    emailA: user.emailA,
                    engAns: user.engAns,
                    engAnsA: user.engAnsA,
                    engAnsB: user.engAnsB,
                    engComment: user.engComment,
                    engFromA: user.engFromA,
                    engFromB: user.engFromB,
                    engFromC: user.engFromC,
                    englishPaper: user.englishPaper,
                    faxNumber: user.faxNumber,
                    hindiAns: user.hindiAns,
                    hindiAnsA: user.hindiAnsA,
                    hindiAnsB: user.hindiAnsB,
                    hindiComment: user.hindiComment,
                    hindiFromA: user.hindiFromA,
                    hindiFromB: user.hindiFromB,
                    hindiFromC: user.hindiFromC,
                    hindiIssued: user.hindiIssued,
                    hindiLoan: user.hindiLoan,
                    hindiPaper: user.hindiPaper,
                    labCount: user.labCount,
                    mainTask: user.mainTask,
                    meetingCountDuringCurrentQtr:
                        user.meetingCountDuringCurrentQtr,
                    memberName: user.memberName,
                    nameAddress: user.nameAddress,
                    noTotal: user.noTotal,
                    noTotalSecond: user.noTotalSecond,
                    notAns: user.notAns,
                    notAnsA: user.notAnsA,
                    notAnsB: user.notAnsB,
                    officers: user.officers,
                    passbookA: user.passbookA,
                    phoneNo: user.phoneNo,
                    recordId: user.recordId,
                    qtr: user.qtr,
                    rrn: user.rrn,
                    signature: user.signature,
                    status: user.status,
                    stdCode: user.stdCode,
                    stdCode_: user.stdCode_,
                    totalComment: user.totalComment,
                    totalFromA: user.totalFromA,
                    totalFromB: user.totalFromB,
                    totalFromC: user.totalFromC,
                    totalHindiIssuedNumber: user.totalHindiIssuedNumber,
                    updatedOn: user.updatedOn,
                    workers: user.workers,
                    year: user.year,
                    zone: user.zone,
                }));
                setUsers(mappedUsers);
            });

        axios.get(`${API_URL}/get-user-all-role`, { headers }).then((res) => {
            if (res?.data?.includes("HO_ADMIN_HINDI_BRANCH_P1")) {
                setHasAddRight(true);
                sethasEditRight(true);
                setHasDeleteRight(true);
                setHasViewRight(true);
                sethasExportExcel(true);
            } else if (res?.data?.includes("ZONE_ADMIN_HINDI_BRANCH_P1")) {
                setHasAddRight(true);
                sethasEditRight(true);
                setHasDeleteRight(false);
                setHasViewRight(true);
                sethasExportExcel(true);
            } else if (res?.data?.includes("USER")) {
                setHasAddRight(true);
                sethasEditRight(true);
                setHasDeleteRight(false);
                setHasViewRight(true);
                sethasExportExcel(true);
            }
        });

        ///Search data option api
        axios
            .get(`http://192.168.60.60:8080/o/commonApi/hindiZone`, {
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
            })
            .catch((err) => console.error("Zone Fetch Error:", err));
    }, []);

    const handleDelete = (user) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete record "${user.rrn}"?`
        );
        if (!confirmDelete) return;
        axios.delete(`${API_URL}/${user.recordId}`, { headers }).then(() => {
            const filteredUser = users.filter(
                (u) => u.recordId !== user.recordId
            );
            setUsers(filteredUser);
        });
    };
    const exportToExcel = async () => {
        try {
            const postData = {
                columnName: filterOptions.columnName,
                columnValue: filterOptions.columnValue,
            };
            const response = await axios.post(`${API_URL}/download`, postData, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = "report.xlsx";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    const handleSubmit = (e) => {
        // e.preventDefault();
        // if (mode === "edit" && id) {
        //     axios
        //         .put(`${API_URL}/${id}`, form, { headers })
        //         .then(() => navigate("/boiform"))
        //         .catch((err) => console.error("Update Error:", err));
        // } else {
        //     axios
        //         .post(`${API_URL}/add`, form, { headers })
        //         .then(() => navigate("/boiform"))
        //         .catch((err) => console.error("Add Error:", err));
        // }
    };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFilterParams((prev) => ({
    //         ...prev,
    //         columnName: name === "zone" ? "zone" : prev.columnName,
    //         columnValue: name === "zone" ? value : prev.columnValue,
    //     }));
    // };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilterOptions((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleClear = () => {
        setFilterOptions({
            columnName: "rrn_",
            columnValue: "",
        });

        const resetParams = {
            ...filterParams,
            columnName: "rrn_",
            columnValue: "",
            pageNumber: 1,
            pageSize: 10,
        };
        setFilterParams(resetParams);

        axios
            .post(`${API_URL}/records`, resetParams, { headers })
            .then((res) => {
                setTotalCount(res?.data?.count);
                const mappedUsers = res?.data?.data.map((user) => ({
                    ...user,
                }));
                setUsers(mappedUsers);
            });
    };

    const handleSearch = () => {
        const updatedParams = {
            ...filterParams,
            columnName: filterOptions.columnName,
            columnValue: filterOptions.columnValue,
            pageNumber: 1,
        };
        setFilterParams(updatedParams);

        axios
            .post(`${API_URL}/records`, updatedParams, { headers })
            .then((res) => {
                setTotalCount(res?.data?.count);
                const mappedUsers = res?.data?.data.map((user) => ({
                    ...user, // map as you already do
                }));
                setUsers(mappedUsers);
            });
    };

    const handlePageChange = (page) => {
        const updatedParams = {
            ...filterParams,
            pageNumber: page,
        };
        setFilterParams(updatedParams);

        axios
            .post(`${API_URL}/records`, updatedParams, { headers })
            .then((res) => {
                setUsers(res?.data?.data || []);
                setTotalCount(res?.data?.count || 0);
                setCurrentPage(page);
            })
            .catch((err) => {
                console.error("Error fetching data for page:", err);
            });
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <h2>Tabular Dashboard View</h2>
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3 container w-100">
                                <div className="form-group col-md-4">
                                    {/* <label>
                                        अंचल{" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </label> */}
                                    {/* <select
                                        className="form-control"
                                        name="zone"
                                        value={filterOptions.columnName || ""}
                                        onChange={handleChange}
                                        // aria-placeholder="Search By"
                                    >
                                     <option value="">Search By</option>
        {orgOptions.map((opt, i) => (
    <option key={i} value={opt.trim()}>{opt}</option>
        ))}
      </select> */}
                                    <select
                                        className="form-control"
                                        name="columnValue"
                                        value={
                                            filterOptions.columnName === "zone"
                                                ? filterOptions.columnValue
                                                : ""
                                        }
                                        onChange={(e) => {
                                            setFilterOptions({
                                                columnName: "zone",
                                                columnValue: e.target.value,
                                            });
                                        }}
                                    >
                                        <option value="">Search By Zone</option>
                                        {orgOptions.map((opt, i) => (
                                            <option key={i} value={opt.trim()}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    {/* <label>
                                        अंचल{" "}
                                        <span style={{ color: "red" }}>*</span>
                                    </label> */}
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="columnValue"
                                        value={
                                            filterOptions.columnName !== "zone"
                                                ? filterOptions.columnValue
                                                : ""
                                        }
                                        placeholder="Search by STD Code"
                                        onChange={(e) =>
                                            setFilterOptions({
                                                columnName: "stdCode_",
                                                columnValue: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="button-group mt-3 col-md-4">
                                    <button
                                        className="btn btn-primary mr-2"
                                        onClick={handleSearch}
                                    >
                                        Search
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleClear}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div className="d-flex justify-content-end">
                            {/* {hasAddRight && ( */}
                            <button
                                className="btn btn-primary mx-2 mb-2"
                                onClick={() => navigate("/boiform/add")}
                            >
                                Add New Record
                            </button>
                            {/* )} */}
                            {hasExportExcel && (
                                <a
                                    className="btn btn-primary mb-2"
                                    target="_blank"
                                    onClick={exportToExcel}
                                >
                                    Export to Excel
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    {headerJSON.map((headerName, index) => (
                                        <th key={index}>{headerName}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={user.recordId}>
                                            <td>{index + 1}</td>
                                            <td>{user.rrn}</td>
                                            <td>{user.qtr}</td>
                                            <td>{user.year}</td>
                                            <td>{user.zone}</td>
                                            <td>{user.branch}</td>
                                            <td>{user.nameAddress}</td>
                                            <td>{user.bhashaiKshetra}</td>
                                            <td>{user.stdCode}</td>
                                            <td>{user.phoneNo}</td>
                                            <td>{user.email}</td>
                                            <td>{user.noTotal}</td>
                                            <td>{user.noTotalSecond}</td>
                                            <td>{user.englishPaper}</td>
                                            <td>
                                                {user.totalHindiIssuedNumber}
                                            </td>
                                            <td>{user.hindiPaper}</td>
                                            <td>{user.hindiAns}</td>
                                            <td>{user.engAns}</td>
                                            <td>{user.notAns}</td>
                                            <td>{user.countFromA}</td>
                                            <td>{user.hindiAnsA}</td>
                                            <td>{user.engAnsA}</td>
                                            <td>{user.notAnsA}</td>
                                            <td>{user.countFromB}</td>
                                            <td>{user.hindiAnsB}</td>
                                            <td>{user.engAnsB}</td>
                                            <td>{user.notAnsB}</td>
                                            <td>{user.hindiFromA}</td>
                                            <td>{user.engFromA}</td>
                                            <td>{user.totalFromA}</td>
                                            <td>{user.hindiFromB}</td>
                                            <td>{user.engFromB}</td>
                                            <td>{user.totalFromB}</td>
                                            <td>{user.hindiFromC}</td>
                                            <td>{user.engFromC}</td>
                                            <td>{user.totalFromC}</td>
                                            <td>{user.hindiComment}</td>
                                            <td>{user.engComment}</td>
                                            <td>{user.totalComment}</td>
                                            <td>{user.labCount}</td>
                                            <td>{user.officers}</td>
                                            <td>{user.workers}</td>
                                            <td>{user.dateRajbhasha}</td>
                                            <td>{user.commeteeNum}</td>
                                            <td>
                                                {
                                                    user.meetingCountDuringCurrentQtr
                                                }
                                            </td>
                                            <td>{user.hindiIssued}</td>
                                            <td>{user.passbookA}</td>
                                            <td>{user.hindiLoan}</td>
                                            <td>{user.allFormsDualLanguage}</td>
                                            <td>{user.mainTask}</td>
                                            <td>{user.signature}</td>
                                            <td>{user.memberName}</td>
                                            <td>{user.designation}</td>
                                            <td>{user.stdCode_}</td>
                                            <td>{user.faxNumber}</td>
                                            <td>{user.emailA}</td>
                                            <td>{user.authorName}</td>
                                            <td>{user.createdOn}</td>

                                            <td>
                                                {hasViewRight && (
                                                    <button
                                                        size="sm"
                                                        onClick={() =>
                                                            navigate(
                                                                `/boiform/view/${user.recordId}`
                                                            )
                                                        }
                                                        className="btn"
                                                    >
                                                        View
                                                    </button>
                                                )}
                                                {hasEditRight && (
                                                    <button
                                                        size="sm"
                                                        onClick={() =>
                                                            navigate(
                                                                `/boiform/edit/${user.recordId}`
                                                            )
                                                        }
                                                        className="btn"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                {hasDeleteRight && (
                                                    <button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(user)
                                                        }
                                                        className="btn"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="59"
                                            style={{ textAlign: "center" }}
                                        >
                                            No data Available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end align-items-center mt-3">
                <nav>
                    <ul className="pagination">
                        {Array.from({
                            length: Math.ceil(
                                totalCount / filterParams.pageSize
                            ),
                        }).map((_, index) => (
                            <li
                                key={index}
                                className={`page-item ${
                                    filterParams.pageNumber === index + 1
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default TableComponent;
