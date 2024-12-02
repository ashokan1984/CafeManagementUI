import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TextField, Button, Box, RadioGroup, FormControlLabel, Radio, MenuItem } from "@mui/material";
import { getCafes } from "../api/cafes"; // API to fetch cafes for dropdown
import { getEmployeesByCafeId, createEmployee } from "../api/employees"; // Mock/actual API endpoints
import "./EmployeeForm.css";

const EmployeeForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cafeId = searchParams.get("cafeId"); // For "Add" mode
  const employeeId = searchParams.get("employeeId"); // For "Edit" mode

  const [cafes, setCafes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    emailAddress: "",
    phoneNumber: "",
    gender: "", // 0 for Male, 1 for Female
    cafeId: cafeId || "", // Default to cafeId if provided
    dateOfJoining: "", // Will map to "startDate" in the API payload
  });

  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility

  useEffect(() => {
    // Fetch available cafes for dropdown
    getCafes().then(setCafes);

    // If editing, fetch employee data and prefill form
    if (employeeId) {
      getEmployeesByCafeId(employeeId).then((data) =>
        setFormData({
          ...data,
          cafeId: data.cafeId || cafeId,
          dateOfJoining: data.startDate || "",
        })
      );
    }
  }, [employeeId, cafeId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 6 || formData.name.length > 10) {
      newErrors.name = "Name must be between 6 and 10 characters.";
    }
    if (!formData.employeeId || formData.employeeId.length < 5 || formData.employeeId.length > 10) {
      newErrors.employeeId = "Employee ID must be between 5 and 10 characters.";
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Invalid email address.";
    }
    if (!/^8\d{7}$|^9\d{7}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must start with 8 or 9 and have 8 digits.";
    }
    if (formData.gender === "") {
      newErrors.gender = "Please select a gender.";
    }
    if (!formData.cafeId) {
      newErrors.cafeId = "Please select a café.";
    }
    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = "Please select a date of joining.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Prepare payload for API
      const payload = {
        ...formData,
        startDate: new Date(formData.dateOfJoining).toISOString(), // Convert to ISO format
        gender: parseInt(formData.gender, 10), // Ensure gender is numeric
      };

      createEmployee(payload)
        .then(() => {
          setShowPopup(true); // Show success popup
        })
        .catch((error) => alert(`Error: ${error.message}`));
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false); // Hide the popup
    setFormData({
      name: "",
      employeeId: "",
      emailAddress: "",
      phoneNumber: "",
      gender: "",
      cafeId: cafeId || "", // Keep default cafeId if provided
      dateOfJoining: "",
    }); // Reset form fields
  };

  return (
    <Box className="employee-form" sx={{ padding: 4, maxWidth: 500, margin: "0 auto" }}>
      <h1>{employeeId ? "Edit Employee" : "Add New Employee"}</h1>
      <TextField
        fullWidth
        margin="normal"
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Employee ID"
        name="employeeId"
        value={formData.employeeId}
        onChange={handleInputChange}
        error={!!errors.employeeId}
        helperText={errors.employeeId}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email Address"
        name="emailAddress"
        value={formData.emailAddress}
        onChange={handleInputChange}
        error={!!errors.emailAddress}
        helperText={errors.emailAddress}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleInputChange}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber}
      />
      <RadioGroup
        name="gender"
        value={formData.gender}
        onChange={handleInputChange}
        row
        sx={{ marginBottom: 2 }}
      >
        <FormControlLabel value="0" control={<Radio />} label="Male" />
        <FormControlLabel value="1" control={<Radio />} label="Female" />
      </RadioGroup>
      {errors.gender && <p className="error-text">{errors.gender}</p>}
      <TextField
        fullWidth
        margin="normal"
        select
        label="Café"
        name="cafeId"
        value={formData.cafeId}
        onChange={handleInputChange}
        error={!!errors.cafeId}
        helperText={errors.cafeId}
      >
        {cafes.map((cafe) => (
          <MenuItem key={cafe.id} value={cafe.id}>
            {cafe.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        margin="normal"
        label="Date of Joining"
        type="date"
        name="dateOfJoining"
        value={formData.dateOfJoining}
        onChange={handleInputChange}
        error={!!errors.dateOfJoining}
        helperText={errors.dateOfJoining}
        InputLabelProps={{
          shrink: true, // Ensures the label stays above the date field
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Box>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Employee saved successfully!</p>
            <Button variant="contained" color="primary" onClick={handlePopupClose}>
              OK
            </Button>
          </div>
        </div>
      )}
    </Box>
  );
};

export default EmployeeForm;
