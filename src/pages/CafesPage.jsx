import React, { useState, useEffect, useRef  } from "react";
import { Box, Button, Typography } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import { getCafes } from "../api/cafes";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-material.css"; // Material theme
import "./CafePage.css";

const CafesPage = () => {
  const gridApi = useRef(null); // Reference for the grid API
  const [cafes, setCafes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCafes().then((data) => setCafes(data));
  }, []);

  const columnDefs = [
    { field: "logoDetail", headerName: "Logo", cellRenderer: LogoRenderer, headerClass: 'header-logo', headerStyle: { fontWeight: 'bold', backgroundColor: '#f0f0f0' }},
    { field: "name", headerName: "Name", headerClass: 'header-name', headerStyle: { textAlign: 'center', fontSize: '16px' } },
    { field: "description", headerName: "Description", headerClass: 'header-description', headerStyle: { fontSize: '14px', color: '#444' } },
    { field: "employeeCount", headerName: "Number Of Employees", headerClass: 'header-employees', headerStyle: { color: '#00796b', fontSize: '16px' } },
    { field: "location", headerName: "Location", headerClass: 'header-location', headerStyle: { textAlign: 'right', fontSize: '16px', color: '#333' }},
    {
      field:"id",
      headerName: "Actions",
      headerClass: 'header-actions',
      cellRenderer: ActionsRenderer,
      cellRendererParams: {
        onEdit: (cafeId) => navigate(`/cafes/edit/${cafeId}`),
        onDelete: (cafeId) => handleDelete(cafeId),
        onViewEmployees: (cafeId) => {navigate(`/employees/${cafeId}`)}
      },
    }
    // { field: "id", headerName: "", cellRenderer: EmployeeLink, headerStyle: { color: '#00796b', fontSize: '16px' }}
  ];

  const handleDelete = (id) => {
    // Confirm and delete logic
  };

  useEffect(() => {
    if (gridApi.current) {
      gridApi.current.sizeColumnsToFit(); // Automatically size the columns to fit the grid's width
    }
  }, [cafes]); // When data changes, resize columns

  const onGridReady = (params) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit(); // Fit the columns when the grid is ready
  };

  return (
    <div className="cafe-page">
    <div className="cafe-header">
      <h1>Café Manager</h1>
      <button className="add-button">Add New Café</button>
    </div>
    <div className="ag-theme-material" style={{ width: "100%" }}>
      <AgGridReact rowData={cafes} columnDefs={columnDefs} domLayout="autoHeight" onGridReady={onGridReady} />
    </div>
  </div>
  

  );
};

const LogoRenderer = ({ value }) => <img src={`data:${value.contentType};base64,${value.bytes}`} alt="Logo" width="50" />;
const ActionsRenderer = ({ value, onEdit, onDelete, onViewEmployees }) => (
    <div style={{ display: 'flex',width:'100%', gap: '5px' }}>
      <Button variant="contained" color="primary" style={{width:"100%"}} size="small" onClick={() => onViewEmployees(value)}>
        View Employees
      </Button>
      <Button variant="contained" color="primary" size="small" onClick={() => onEdit(value)}>
        Edit
      </Button>
      <Button variant="contained" color="secondary" size="small" onClick={() => onDelete(value)}>
        Delete
      </Button>
    </div>
);

export default CafesPage;
