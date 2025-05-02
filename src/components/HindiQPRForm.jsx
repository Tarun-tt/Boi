import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Hindi.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://192.168.60.60:8080/o/student';
const headers = {};

function HindiQPRForm({ mode }) {
  const [form, setForm] = useState({
    quarterEndDate: '31 मार्च',
    year: '2025',
    bankBranch: '',
    organization: '',
    branch: '',
    area: '',
    officerPhone: ''
  });

  const [orgOptions, setOrgOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setOrgOptions(['Option 1', 'Option 2']);
    setBranchOptions(['Branch 1', 'Branch 2']);
    setAreaOptions(['Urban', 'Rural']);

    if ((mode === 'edit' || mode === 'view') && id) {
      axios.get(`${API_URL}/${id}`, { headers }).then((res) => {
        setForm(res.data);
      });
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'edit' && id) {
      axios.put(`${API_URL}/${id}`, form, { headers }).then(() => {
        navigate('/roiform');
      });
    } else {
      axios.post(API_URL, form, { headers }).then(() => {
        navigate('/roiform');
      });
    }
  };

  return (
    <div className="container mt-4">
      <h3>Hindi QPR Branch March Part - 1 - 2025</h3>
      <label><span style={{ color: 'red' }}>*</span>Indicated required fields</label>
      <h4><span>*</span>सरकारी क्षेत्र के बैंकों एवं वित्तीय संस्थाओं में राजभाषा हिंदी के प्रगामी प्रयोग से संबंधित तिमाही प्रगति रिपोर्ट</h4>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
        <div className="col-md-3">
        </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>तिमाही <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                className="form-control"
                name="quarterEndDate"
                value={form.quarterEndDate}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>साल <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                className="form-control"
                name="year"
                value={form.year}
                onChange={handleChange}
                disabled={mode === 'view'}
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
      <label>शाखा/कार्यालय का नाम</label>
      {/* <input
        type="text"
        className="form-control"
        name="bankBranch"
        value={form.bankBranch}
        onChange={handleChange}
        disabled={mode === 'view'}
        placeholder="बैंक ऑफ इंडिया -1"
      /> */}
    </div>
  </div>

  <div className="col-md-4">
    <div className="form-group mb-3">
      <label>अंचल <span style={{ color: 'red' }}>*</span></label>
      <select
        className="form-control"
        name="branch"
        value={form.branch}
        onChange={handleChange}
        disabled={mode === 'view'}
        required
      >
        <option value="">Choose an Option</option>
        {branchOptions.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  </div>

  <div className="col-md-4">
    <div className="form-group mb-3">
      <label>शाखा <span style={{ color: 'red' }}>*</span></label>
      <select
        className="form-control"
        name="branch"
        value={form.branch}
        onChange={handleChange}
        disabled={mode === 'view'}
        required
      >
        <option value="">Choose an Option</option>
        {branchOptions.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
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
            name="officerPhone"
            value={form.officerPhone}
            onChange={handleChange}
            disabled={mode === 'view'}
          />
        </div>

      

        <div className="form-group mb-3 col-md-4">
          <label>भाषाई क्षेत्र</label>
          <select
            className="form-control"
            name="area"
            value={form.area}
            onChange={handleChange}
            disabled={mode === 'view'}
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
          {/* <input
            type="text"
            className="form-control"
            name="officerPhone"
            value={form.officerPhone}
            onChange={handleChange}
            disabled={mode === 'view'}
          /> */}
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
                disabled={mode === 'view'}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label>फोन नं.</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={mode === 'view'}
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
                disabled={mode === 'view'}
              />
            </div>
          </div>
        </div>

        <div className="form-group mb-3">
        <label>1. राजभाषा अधिनियम 1963 की धारा 3(3) के अंतर्गत जारी कागजात*</label>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-group">
              <label>(क) जारी कागजात की कुल संख्या</label>
              <input
                type="text"
                className="form-control"
                name="totalDocumentsIssued"
                value={form.totalDocumentsIssued}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>(ख) द्विभाषी रूप में जारी कागज़ात की संख्‍या</label>
              <input
                type="text"
                className="form-control"
                name="documentsInHindi"
                value={form.documentsInHindi}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-group">
              <label>(ग) केवल अंग्रेजी में जारी किये गये कागजात</label>
              <input
                type="text"
                className="form-control"
                name="totalDocumentsIssued"
                value={form.totalDocumentsIssued}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>(घ) केवल हिंदी में जारी किये गये कागजात</label>
              <input
                type="text"
                className="form-control"
                name="documentsInHindi"
                value={form.documentsInHindi}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
          </div>
          <label className='mt-3'>*इनमें सामान्य आदेश, ज्ञापन, संकल्प, अधिसूचनाएं, नियम, करार, संविदा, टेंडर नोटिस,संसदीय प्रश्न, आदि शामिल हैं।</label>
        </div>
       
        <div className="form-group mb-3">
        <label>2.हिंदी में प्राप्त पत्र (राजभाषा नियम - 5)</label>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-group">
              <label>(क) हिंदी में प्राप्त कुल पत्रों की संख्या</label>
              <input
                type="text"
                className="form-control"
                name="totalDocumentsIssued"
                value={form.totalDocumentsIssued}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>(ख) द्विभाषी रूप में जारी कागज़ात की संख्‍या</label>
              <input
                type="text"
                className="form-control"
                name="documentsInHindi"
                value={form.documentsInHindi}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-group">
              <label>(ग) इनमें से कितनों के उत्तर अंग्रेजी में दिए गए</label>
              <input
                type="text"
                className="form-control"
                name="totalDocumentsIssued"
                value={form.totalDocumentsIssued}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>(घ) इनमें से कितनों के उत्तर दिए जाने अपेक्षित नहीं थे</label>
              <input
                type="text"
                className="form-control"
                name="documentsInHindi"
                value={form.documentsInHindi}
                onChange={handleChange}
                disabled={mode === 'view'}
              />
            </div>
          </div>
        </div>
        <div className="form-group mb-3">
        <label>3. अंग्रेजी में प्राप्त पत्रों के उत्तर हिंदी में दिए जाने की स्थिति (केवल ‘क’ और ‘ख’ क्षेत्रों में स्थित कार्यालयों के लिए)</label>
        </div>
        <div className="row mb-3">
          <label className="col-md-3"></label>
          <label className="col-md-3">अंग्रेजी में प्राप्त पत्रों की संख्या</label>
          <label className="col-md-3">इनमें से कितनों के उत्तर हिंदी में दिए गए</label>
          <label className="col-md-3">इनमें से कितनों के उत्तर अपेक्षित नहीं थे</label>
        </div>
        <div className="row mb-3">
          <label className="col-md-3">क’क्षेत्र</label>
          <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
        </div>
        <div className="row mb-3">
          <label className="col-md-3">ख’क्षेत्र </label>
          <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
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
          <label className="col-md-3"> भेजे गए पत्रों की कुल संख्या</label>
        </div>
        <div className="row mb-3">
          <label className="col-md-3">क’क्षेत्र</label>
          <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
        </div>
        <div className="row mb-3">
          <label className="col-md-3">ख’क्षेत्र </label>
          <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
        </div>
        <div className="row mb-3">
          <label className="col-md-3">ग’क्षेत्र  </label>
          <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  <div className="col-md-3">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
        </div>

        <div className="form-group mb-3">
        <label>5. (तिमाही के दौरान) फाइलों /दस्तावेजों पर हिंदी में लिखी गई टिप्पणियॉं</label>
        </div>
    
        <div className="row mb-3">
          <label className="col-md-3">हिंदी में लिखी गई टिप्‍पणियों के पृष्‍ठों की संख्‍या</label>
          <div className="col-md-9">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  
        </div>
        <div className="row mb-3">
          <label className="col-md-3">अंग्रेजी में लिखी गई टिप्‍पणियों के पृष्‍ठों की संख्‍या</label>
          <div className="col-md-9">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  
        </div>
        <div className="row mb-3">
          <label className="col-md-3">कुल टिप्‍पणियों के पृष्‍ठों  की संख्‍या</label>
          <div className="col-md-9">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  
        </div>
        <div className="row mb-3">
          <label className="col-md-6">पृष्‍ठों की संख्‍या की गणना पूर्ण अंक एवं आधा अंक में ही की जाए ।</label>
          <div className="col-md-6">

  </div>
  
        </div>
        <div className="form-group mb-3">
        <label>6. हिंदी कार्यशालाएं</label>
        </div>
        <div className="row mb-3">
          <label className="col-md-3">तिमाही के दौरान पूर्ण दिवसीय आयोजित कार्यशालाओं की संख्‍या</label>
          <div className="col-md-9">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  
        </div>
        <div className="row mb-3">
          <label className="col-md-4">तिमाही के दौरान पूर्ण दिवसीय आयोजित कार्यशालाओं की संख्‍या</label>
          <label className="col-md-4">अधिकारी</label>
          <label className="col-md-4">कर्मचारी</label>
  
        </div>
        <div className="row mb-3">
          <label className="col-md-4"></label>
          <div className="col-md-4">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  <div className="col-md-4">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  
        </div>
        <label> नोट : कार्यालय के समस्‍त कार्मिकों को 2 वर्ष में कम से कम एक बार प्रशिक्षित किया जाना आवश्‍यक है।</label>
        <div className="form-group mb-3 container">
        <label>7. विभागीय/संगठनीय राजभाषा कार्यान्‍वयन समिति की बैठक के आयोजन की तिथि</label>
        <div className="row mb-3">
          <label className="col-md-6">(क) राजभाषा कार्यान्वयन समिति की बैठक की तिथि (केंद्रीय/प्रधान कार्यालय की)</label>
          <label className="col-md-6">(ख) अधीनस्थ कार्यालयों में गठित राजभाषा का.समितियों की संख्या</label>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
    <input
      type="date"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  <div className="col-md-6">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  
        </div>
        <div className="row mb-3">
          <label className="col-md-6">(ग) इस तिमाही में आयोजित बैठकों की संख्या</label>
          <label className="col-md-6">(घ) बैठकों से संबंधित कार्यसूची और कार्यवृत्त क्या हिंदी में जारी किये गये</label>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  <div className="col-md-6">
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="radio"
      name="engLetters"
      id="engLettersYes"
      value="yes"
      // checked={form.engLetters === 'yes'}
      // onChange={handleChange}
      disabled={mode === 'view'}
    />
    <label className="form-check-label" htmlFor="engLettersYes"> हाँ</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="radio"
      name="engLetters"
      id="engLettersNo"
      value="no"
      // checked={form.engLetters === 'no'}
      // onChange={handleChange}
      disabled={mode === 'view'}
    />
    <label className="form-check-label" htmlFor="engLettersNo">नहीं</label>
  </div>
</div>

  
        </div>

        </div>

        <div className="form-group mb-3 container">
        <label>8. कामकाज में हिंदी का प्रयोग</label>
        <div className="row mb-3">
          <label className="col-md-6">(i) पासबुक हिंदी में भरने (नाम,पता,जमा,डेबिट आदि) की सुविधा उपलब्‍ध है ?</label>
          <div className="col-md-6">
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="radio"
      name="engLetters"
      id="engLettersYes"
      value="yes"
      // checked={form.engLetters === 'yes'}
      // onChange={handleChange}
      disabled={mode === 'view'}
    />
    <label className="form-check-label" htmlFor="engLettersYes"> हाँ</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="radio"
      name="engLetters"
      id="engLettersNo"
      value="no"
      // checked={form.engLetters === 'no'}
      // onChange={handleChange}
      disabled={mode === 'view'}
    />
    <label className="form-check-label" htmlFor="engLettersNo">नहीं</label>
  </div>
</div>
        </div>
        <div className="row mb-3">
          <label className="col-md-6">(ii) ऋण वसूली पत्र हिंदी में जारी किए जाते हैं ?</label>
          <div className="col-md-6">
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="radio"
      name="engLetters"
      id="engLettersYes"
      value="yes"
      // checked={form.engLetters === 'yes'}
      // onChange={handleChange}
      disabled={mode === 'view'}
    />
    <label className="form-check-label" htmlFor="engLettersYes"> हाँ</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="radio"
      name="engLetters"
      id="engLettersNo"
      value="no"
      // checked={form.engLetters === 'no'}
      // onChange={handleChange}
      disabled={mode === 'view'}
    />
    <label className="form-check-label" htmlFor="engLettersNo">नहीं</label>
  </div>
</div>
        </div>
        <div className="row mb-3">
          <label className="col-md-6">(iii) सारे फार्म(वाउचर/ड्राफ्ट/जमा रसीदें इत्‍यादि) द्विभाषी हैं?</label>
          <div className="col-md-6">
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="radio"
      name="engLetters"
      id="engLettersYes"
      value="yes"
      // checked={form.engLetters === 'yes'}
      // onChange={handleChange}
      disabled={mode === 'view'}
    />
    <label className="form-check-label" htmlFor="engLettersYes"> हाँ</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="radio"
      name="engLetters"
      id="engLettersNo"
      value="no"
      // checked={form.engLetters === 'no'}
      // onChange={handleChange}
      disabled={mode === 'view'}
    />
    <label className="form-check-label" htmlFor="engLettersNo">नहीं</label>
  </div>
</div>
        </div>
        <div className="row mb-3">
  <label className="col-md-6">
    9. तिमाही में किए गए उल्लेखनीय कार्य/उपलब्धियों का संक्षिप्त विवरण (अधिकतम 250 कैरेक्टर)
  </label>
  <div className="col-md-6">  </div>
  <div className="col-md-12">
  <textarea
      className="form-control"
      name="documentsInHindi"
      value={form.documentsInHindi}
      onChange={handleChange}
      disabled={mode === 'view'}
      maxLength={250}
      rows={4} 
    />
</div>

</div>
        </div>


        <div className="form-group mb-3">
        <label>उल्लिखित सूचना उपलब्ध अभिलेखों के आधार पर बनाई गई है तथा मेरी जानकारी के अनुसार सही है |</label>
        </div>
        <div className="row mb-3">
        <div className="col-md-4"></div>
          <label className="col-md-4">बैंक की राजभाषा कार्यान्वयन समिति के अध्यक्ष के हस्ताक्षर</label>
          <div className="col-md-4">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
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
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
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
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  
        </div>
   
        <div className="row mb-3">
        <div className="col-md-4"></div>
          <label className="col-md-4">एसटीडी कोड सहित फोन नम्बर</label>
          <div className="col-md-4">
    <input
      type="text"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
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
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  
        </div>
    
        <div className="row mb-3">
        <div className="col-md-4"></div>
          <label className="col-md-4">ई-मेल का पता</label>
          <div className="col-md-4">
    <input
      type="email"
      className="form-control"
      name="engLetters"
      value={form.engLetters}
      onChange={handleChange}
      disabled={mode === 'view'}
    />
  </div>
  
        </div>
        <label>नोट: कोई  भी  कॉलम  खाली  न  छोड़ा जाए  और सूचना स्पष्ट रूप  से  दी जाए।</label>



        
        

        
       

































        <div className="button-group mt-3">
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/roiform')}>
            Cancel
          </button>
          {mode !== 'view' && (
            <button className="btn btn-primary" type="submit">
              {mode === 'add' ? 'Submit' : 'Update'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default HindiQPRForm;
