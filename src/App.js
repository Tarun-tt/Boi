import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TableComponent from './components/TableComponent';
import FormComponent from './components/FormComponent';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/boiform" />} />
      <Route path="/boiform" element={<TableComponent />} />
      <Route path="/boiform/add" element={<FormComponent mode="add" />} />
      <Route path="/boiform/edit/:id" element={<FormComponent mode="edit" />} />
      <Route path="/boiform/view/:id" element={<FormComponent mode="view" />} />
    </Routes>
  );
}

export default App;
