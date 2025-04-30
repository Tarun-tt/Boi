import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// const API_URL = '/o/student';
// const API_FILE_URL = '/o/headless-delivery/v1.0/document-folders/62789/documents';
const API_URL = 'http://192.168.60.60:8080/o/student';
const API_FILE_URL = 'http://192.168.60.60:8080/o/headless-delivery/v1.0/document-folders/62789/documents';
// const csrfToken = window?.Liferay?.authToken || "";
// const headers = {
  // "Content-Type": "application/json",
  // "x-csrf-token": csrfToken,
// };
const headers = {
  };
function FormComponent({ mode }) {
  const [form, setForm] = useState({
    fgmoName: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  const [fgmo, setFgmo] = useState([]);
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/get-all-fgmo-name`, { headers }).then((res) => {
      const mappedFgmo = res.data.map((obj) => ({
        organizationid: obj.organizationid,
        name: obj.name,
      }));
      setFgmo(mappedFgmo);
    });

    if ((mode === 'edit' || mode === 'view') && id) {
      axios.get(`${API_URL}/${id}`, { headers }).then((res) => {
        const user = res.data;
        setForm({
          fgmoName: user.fgmoName,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      });
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const data = new FormData();
    if (selectedFile) {
      data.append('file', selectedFile);
      axios.post(`${API_FILE_URL}`, data, { headers }).then((res) => {
        const uploadedFileId = res.data.id;
        setFileId(uploadedFileId);
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      fgmoName: form.fgmoName,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      fileEntryId: fileId,
    };

    if (mode === 'edit' && id) {
      axios.put(`${API_URL}/${id}`, payload, { headers }).then(() => {
        navigate('/roiform');
      });
    } else if (mode === 'add') {
      axios.post(API_URL, payload, { headers }).then(() => {
        navigate('/roiform');
      });
    }
  };

  return (
    <div className="container">
      <h2>{mode === 'add' ? 'Add User' : mode === 'edit' ? 'Edit User' : 'View User'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          FGMO:
          <select
            name="fgmoName"
            value={form.fgmoName}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
          >
            <option value="" disabled>
              Select FGMO
            </option>
            {fgmo.map((fg) => (
              <option key={fg.organizationid} value={fg.organizationid}>
                {fg.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={mode === 'view'}
            required
          />
        </label>
        {mode !== 'view' && (
          <label>
            Upload File:
            <input type="file" onChange={handleFileChange} />
          </label>
        )}
        <div className="button-group">
          <button type="button" onClick={() => navigate('/roiform')} className="btn">
            Cancel
          </button>
          {mode !== 'view' && (
            <button type="submit" className="btn">
              {mode === 'add' ? 'Add' : 'Update'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default FormComponent;
