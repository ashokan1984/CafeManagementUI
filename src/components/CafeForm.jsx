import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import { updateCafe } from "../api/cafes";  // Assuming you have this API method

const CafeForm = () => {
  const navigate = useNavigate();  // Hook for navigation
  const location = useLocation();  // Hook to get location object
  const { defaultValues } = location.state || {};  // Get default values (for editing)

  const { register, handleSubmit, reset } = useForm();
  const [logoFile, setLogoFile] = useState(null);  // Store the logo file

  // Set the form default values when they are available
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);  // Populate the form with existing cafe data
    }
  }, [defaultValues, reset]);

  // Handle file input and convert the logo to base64
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoFile({
          bytes: reader.result.split(',')[1], // base64 encoded string
          contentType: file.type,  // file type (MIME)
        });
      };
      reader.readAsDataURL(file);  // Read the file as base64
    }
  };

  // Handle form submission (to update the cafe)
  const onSubmit = (data) => {
    const updatedCafe = {
      id: defaultValues.id,  // Use the existing cafe ID for the update
      name: data.name,
      description: data.description,
      logo: logoFile,  // Use the newly set logo if changed
      location: data.location,
    };

    updateCafe(updatedCafe)  // Call the API to update the cafe
      .then(() => {
        console.log("Cafe updated successfully!");
        navigate("/");  // Redirect back to CafesPage after success
      })
      .catch((error) => {
        console.error("Error updating cafe:", error);
        alert("Failed to update cafe.");
      });
  };

  // Handle the Cancel button click
  const handleCancel = () => {
    navigate("/");  // Navigate back to CafesPage without saving
  };

  return (
    <div>
      <h1>{defaultValues ? "Edit Cafe" : "Add New Cafe"}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Name"
          {...register("name", { required: true })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          {...register("description", { required: true })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Location"
          {...register("location", { required: true })}
          fullWidth
          margin="normal"
        />

        {/* File input for logo */}
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          style={{ marginTop: '10px' }}
        />

        <Button type="submit" variant="contained" color="primary">
          Update
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCancel}  // Navigate back to CafesPage
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default CafeForm;
