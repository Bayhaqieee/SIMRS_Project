import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import axios from "axios";

const DoctorPasswordManagement = () => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [doctor, setDoctor] = useState(null);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // In a real application, you would get the doctor's info from login session or context
    fetchDoctorInfo();
  }, []);

  const fetchDoctorInfo = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get("/api/doctors/current");
      setDoctor(response.data);
    } catch (error) {
      console.error("Error fetching doctor info:", error);
      showAlert("Failed to fetch doctor information", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
      valid = false;
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
      valid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
      valid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Replace with your actual API endpoint
      await axios.put("/api/doctors/password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      showAlert("Password updated successfully", "success");

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);

      if (error.response && error.response.status === 401) {
        setErrors({
          ...errors,
          currentPassword: "Current password is incorrect",
        });
        showAlert("Current password is incorrect", "error");
      } else {
        showAlert("Failed to update password. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom component="div">
        Change Password
      </Typography>

      {loading && !doctor ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 2 }}>
          <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
            <LockIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Update Your Password</Typography>
          </Box>

          {doctor && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1">
                <strong>Doctor:</strong> {doctor.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {doctor.email}
              </Typography>
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  error={!!errors.newPassword}
                  helperText={
                    errors.newPassword ||
                    "Password must be at least 8 characters"
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Password security tips:
            </Typography>
            <ul style={{ paddingLeft: "20px", color: "text.secondary" }}>
              <li>Use at least 8 characters</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Add numbers and special characters</li>
              <li>Avoid using easily guessable information</li>
            </ul>
          </Box>
        </Paper>
      )}

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorPasswordManagement;
