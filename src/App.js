import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TableComponent from './components/TableComponent';
import FormComponent from './components/FormComponent';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/roiform" />} />
      <Route path="/roiform" element={<TableComponent />} />
      <Route path="/roiform/add" element={<FormComponent mode="add" />} />
      <Route path="/roiform/edit/:id" element={<FormComponent mode="edit" />} />
      <Route path="/roiform/view/:id" element={<FormComponent mode="view" />} />
    </Routes>
  );
}

export default App;
