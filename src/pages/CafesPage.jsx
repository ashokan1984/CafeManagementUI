import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import { getCafes, createCafe, deleteCafe } from "../api/cafes"; // Import deleteCafe method
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS
import "ag-grid-community/styles/ag-theme-material.css"; // Material theme
import "./CafePage.css";

const CafesPage = () => {
  const gridApi = useRef(null); // Reference for the grid API
  const [cafes, setCafes] = useState([]);
  const [showForm, setShowForm] = useState(false); // To toggle the form visibility
  const [newCafe, setNewCafe] = useState({
    name: "",
    description: "",
    logo: { bytes: "", contentType: "" },
    location: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    getCafes().then((data) => setCafes(data)); // Fetch existing cafes
  }, []);

  const columnDefs = [
    { field: "logoDetail", headerName: "Logo", cellRenderer: LogoRenderer, headerClass: 'header-logo', headerStyle: { fontWeight: 'bold', backgroundColor: '#f0f0f0' }},
    { field: "name", headerName: "Name", headerClass: 'header-name', headerStyle: { textAlign: 'center', fontSize: '16px' }},
    { field: "description", headerName: "Description", headerClass: 'header-description', headerStyle: { fontSize: '14px', color: '#444' }},
    { field: "employeeCount", headerName: "Number Of Employees", headerClass: 'header-employees', headerStyle: { color: '#00796b', fontSize: '16px' }},
    { field: "location", headerName: "Location", headerClass: 'header-location', headerStyle: { textAlign: 'right', fontSize: '16px', color: '#333' }},
    {
      field: "id",
      headerName: "Actions",
      headerClass: 'header-actions',
      cellRenderer: ActionsRenderer,
      cellRendererParams: {
        onEdit: (cafeId) => navigate(`/cafes/edit/${cafeId}`),
        onDelete: (cafeId) => handleDelete(cafeId),
        onViewEmployees: (cafeId) => { navigate(`/employees/${cafeId}`); }
      },
    }
  ];

  // Handle the delete functionality
  const handleDelete = (id) => {
    // Show confirmation dialog before proceeding with deletion
    if (window.confirm("Are you sure you want to delete this café?")) {
      // Call the deleteCafe method with the cafe ID
      deleteCafe(id)
        .then(() => {
          // Filter out the deleted cafe from the list
          setCafes((prevCafes) => prevCafes.filter((cafe) => cafe.id !== id));
          alert("Cafe deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting cafe:", error);
          alert("Failed to delete cafe.");
        });
    }
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

  // Handle form submission for creating a new cafe
  const handleSubmit = () => {
    createCafe(newCafe).then((response) => {
      setCafes((prevCafes) => [...prevCafes, response]); // Add the newly created cafe to the list
      alert("Cafe created successfully!"); // Show the success message

      // Clear the form fields after the success message
      setNewCafe({
        name: "",
        description: "",
        logo: { bytes: "", contentType: "" },
        location: "",
      }); // Reset the form fields to empty
    }).catch((error) => {
      console.error("Error creating cafe:", error);
      alert("Failed to create cafe.");
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCafe((prevCafe) => ({
      ...prevCafe,
      [name]: value,
    }));
  };

  // Handle file input and convert image to base64
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCafe((prevCafe) => ({
          ...prevCafe,
          logo: {
            bytes: reader.result.split(',')[1], // Get base64 encoded string without 'data:image/*;base64,' prefix
            contentType: file.type,
          },
        }));
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  return (
    <div className="cafe-page">
      <div className="cafe-header">
        <h1>Café Manager</h1>
        <Button
          className="add-button"
          variant="contained"
          color="primary"
          onClick={() => setShowForm(true)} // Show the form when clicked
        >
          Add New Café
        </Button>
      </div>

      {showForm && (
        <div className="add-cafe-form">
          <Typography variant="h6">Create New Café</Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={newCafe.name}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            name="description"
            value={newCafe.description}
            onChange={handleChange}
          />
          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            margin="normal"
            name="location"
            value={newCafe.location}
            onChange={handleChange}
          />

          {/* File input for logo */}
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            style={{ marginTop: '10px' }}
          />

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowForm(false)} // Close the form without saving
          >
            Cancel
          </Button>
        </div>
      )}

      {!showForm && (
        <div className="ag-theme-material" style={{ width: "100%" }}>
          <AgGridReact rowData={cafes} columnDefs={columnDefs} domLayout="autoHeight" onGridReady={onGridReady} />
        </div>
      )}
    </div>
  );
};

const LogoRenderer = ({ value }) => <img src={`data:${value.contentType};base64,${value.bytes}`} alt="Logo" width="50" />;
const ActionsRenderer = ({ value, onEdit, onDelete, onViewEmployees }) => (
  <div style={{ display: 'flex', width: '100%', gap: '5px' }}>
    <Button variant="contained" color="primary" size="small" onClick={() => onViewEmployees(value)}>
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
