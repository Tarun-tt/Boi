import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';

// const API_URL = '/o/student';
const API_URL = 'http://192.168.60.60:8080/o/student';

// const csrfToken = window?.Liferay?.authToken || "";
// const headers = {
  // "Content-Type": "application/json",
  // "x-csrf-token": csrfToken,
// };
const headers = {
};

function TableComponent() {
  const [users, setUsers] = useState([]);
  const [deleteShow, setDeleteShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/all`, { headers }).then((res) => {
      const mappedUsers = res.data.map((user) => ({
      
        id: user.studentId,
        fgmoName: user.fgmoName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
     

      }));

      setUsers(mappedUsers);
      console.log("user",mappedUsers);
    });

    axios.get(`${API_URL}/get-user-all-role`, { headers }).then((res) => {
      console.log("resresresresresresresres",res);
      
      // const hasRole = res?.data?.includes('HOADMIN');
      const hasRole = res?.data[0]?.includes('Guest');

      setDeleteShow(hasRole);
    });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/${id}`, { headers }).then(() => {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    });
  };

  const exportToExcel = () => {
    const worksheetData = users.map((user) => ({
      FGMO: user.fgmoName,
      'First Name': user.firstName,
      'Last Name': user.lastName,
      Email: user.email,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    XLSX.writeFile(workbook, 'users.xlsx');
  };

  return (
    <div className="container">
      <h2>Tabular Dashboard View</h2>
      <button onClick={() => navigate('/roiform/add')} className="btn">
        Add User
      </button>
      <button onClick={exportToExcel} className="btn">
        Export to Excel
      </button>
      <table>
        <thead>
          <tr>
            <th>FGMO</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.fgmoName}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>
              <button onClick={() => navigate(`/roiform/edit/${user.id}`)} className="btn">
                  Edit
                </button>
                <button onClick={() => navigate(`/roiform/view/${user.id}`)} className="btn">
                  View
                </button>
            
                {deleteShow && (
                  <button onClick={() => handleDelete(user.id)} className="btn">
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableComponent;
