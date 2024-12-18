import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { deleteEmployee, getEmployeesByCafeId } from "../api/employees"; // Mock or actual API endpoint
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "./EmployeesPage.css";

const EmployeesPage = () => {
  const { cafeId } = useParams(); // Get cafeId from route params
  const navigate = useNavigate(); // Initialize navigate
  const gridApi = useRef(null); // Reference for AG Grid API
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (cafeId) {
        console.log(cafeId);
      // Fetch employees for the given cafeId
      getEmployeesByCafeId(cafeId).then((data) => setEmployees(data));
    }
  }, [cafeId]);

  const columnDefs = [
    { field: "employeeId", headerName: "Employee ID", sortable: true, filter: true },
    { field: "name", headerName: "Name", sortable: true, filter: true },
    { field: "emailAddress", headerName: "Email Address", sortable: true },
    { field: "phoneNumber", headerName: "Phone Number", sortable: true },
    { field: "noOfDaysWorked", headerName: "Days Worked", sortable: true },
    { field: "cafeName", headerName: "Café Name", sortable: true },
    {
      field: "id", 
      headerName: "Actions",
      cellRenderer: ActionsRenderer,
      cellRendererParams: {
        onEdit: (id) => console.log(`Edit employee ${id}`),
        onDelete: (id) => handleDelete(id), 
      },
    },
  ];

 // Handle the delete functionality
const handleDelete = (id) => {
    alert(`Deleting employee with ID: ${id}`);
    console.log(`Deleting employee with ID: ${id}`);

    // Show confirmation dialog before proceeding with deletion
    if (window.confirm("Are you sure you want to delete this employee?")) {
      // Call the employee delete method with the employee ID
      deleteEmployee(id)
        .then(() => {
          // Optionally, reload the employee list from the API to get the latest data
          getEmployeesByCafeId(cafeId).then((data) => {
            setEmployees(data); // Update the grid with the latest list of employees
          });

          alert("Employee deleted successfully!"); // Show success message
        })
        .catch((error) => {
          console.error("Error deleting employee:", error);
          alert("Failed to delete employee. Please try again."); // Show error message
        });
    }
};


  const onGridReady = (params) => {
    gridApi.current = params.api;
    params.api.sizeColumnsToFit(); // Automatically size columns
  };

  const handleAddEmployee = () => {
    navigate(`/employees/add/${cafeId}`); // Redirect with cafeId as a query parameter
  };

  return (
    <div className="employees-page">
      <div className="employees-header">
         <Button variant="contained" color="primary" onClick={handleAddEmployee}>
          Add New Employee
        </Button>
      </div>
      <div className="ag-theme-material" style={{ width: "100%", height: "500px" }}>
        <AgGridReact
          rowData={employees}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

// ActionsRenderer Component
const ActionsRenderer = ({ data, onEdit, onDelete }) => (
    <div style={{ display: "flex", gap: "5px" }}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => onEdit(data.id)} // Use data.employeeId
      >
        Edit
      </Button>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => onDelete(data.id)} // Use data.employeeId
      >
        Delete
      </Button>
    </div>
  );

export default EmployeesPage;
