import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import { getCafes, createCafe, deleteCafe, updateCafe } from "../api/cafes"; // Add updateCafe method
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-material.css"; 
import "./CafePage.css";

const CafesPage = () => {
  const gridApi = useRef(null); 
  const [cafes, setCafes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCafe, setNewCafe] = useState({
    name: "",
    description: "",
    logo: { bytes: "", contentType: "" },
    location: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    getCafes().then((data) => setCafes(data)); 
  }, []);

  const columnDefs = [
    { field: "logoDetail", headerName: "Logo", cellRenderer: LogoRenderer },
    { field: "name", headerName: "Name" },
    { field: "description", headerName: "Description" },
    { field: "employeeCount", headerName: "Number Of Employees" },
    { field: "location", headerName: "Location" },
    {
      field: "id",
      headerName: "Actions",
      cellRenderer: ActionsRenderer,
      cellRendererParams: {
        onEdit: (cafeId) => {
          const cafeData = cafes.find((cafe) => cafe.id === cafeId);
          console.log("Navigating with data:", cafeData);
          navigate(`/cafes/edit/${cafeId}`, { state: { defaultValues: cafeData } });
        },
        onDelete: (cafeId) => handleDelete(cafeId),
        onViewEmployees: (cafeId) => { navigate(`/employees/${cafeId}`); }
      },
    }
  ];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this café?")) {
      deleteCafe(id)
        .then(() => {
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
      gridApi.current.sizeColumnsToFit(); 
    }
  }, [cafes]);

  const onGridReady = (params) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit(); 
  };

  const handleSubmit = () => {
    // Ensure that logo is always defined
    const cafeToSubmit = {
      ...newCafe,
      logo: newCafe.logo || { bytes: "", contentType: "" },  // Default to an empty logo object if not set
    };
  
    createCafe(cafeToSubmit).then((response) => {
      setCafes((prevCafes) => [...prevCafes, response]);
      alert("Cafe created successfully!");
      setNewCafe({ name: "", description: "", logo: { bytes: "", contentType: "" }, location: "" });
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCafe((prevCafe) => ({
          ...prevCafe,
          logo: {
            bytes: reader.result.split(',')[1],
            contentType: file.type,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Cancel button
  const handleCancel = () => {
    setShowForm(false); // Close the form
    navigate("/");  // Navigate back to CafesPage
  };

  return (
    <div className="cafe-page">
      <div className="cafe-header">
        <h1>Café Manager</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(true)} 
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
            onClick={handleCancel}  // Close the form and navigate back to CafesPage
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
const ActionsRenderer = ({ value, data, onEdit, onDelete, onViewEmployees }) => (
  <div style={{ display: 'flex', gap: '5px' }}>
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
