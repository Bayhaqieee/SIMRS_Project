import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import axios from "axios";

const MedicalRecordManagement = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const [formData, setFormData] = useState({
    id: "",
    patientId: "",
    doctorId: "",
    visitDate: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredRecords(medicalRecords);
    } else {
      const filtered = medicalRecords.filter(
        (record) =>
          record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  }, [searchTerm, medicalRecords]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // In a real application, replace these URLs with your actual API endpoints
      const recordsResponse = await axios.get("/api/medicalRecords");
      const patientsResponse = await axios.get("/api/patients");
      const doctorsResponse = await axios.get("/api/doctors");

      setMedicalRecords(recordsResponse.data);
      setFilteredRecords(recordsResponse.data);
      setPatients(patientsResponse.data);
      setDoctors(doctorsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showAlert("Failed to fetch data", "error");
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

  const handleOpen = (record = null) => {
    if (record) {
      setFormData({
        id: record.id,
        patientId: record.patientId,
        doctorId: record.doctorId,
        visitDate: record.visitDate,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        prescription: record.prescription,
        notes: record.notes,
      });
    } else {
      setFormData({
        id: "",
        patientId: "",
        doctorId: "",
        visitDate: new Date().toISOString().split("T")[0],
        diagnosis: "",
        treatment: "",
        prescription: "",
        notes: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (formData.id) {
        // Update existing record
        await axios.put(`/api/medicalRecords/${formData.id}`, formData);
        showAlert("Medical record updated successfully", "success");
      } else {
        // Create new record
        await axios.post("/api/medicalRecords", formData);
        showAlert("Medical record created successfully", "success");
      }
      fetchData();
      handleClose();
    } catch (error) {
      console.error("Error saving record:", error);
      showAlert("Failed to save medical record", "error");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this medical record?")
    ) {
      try {
        await axios.delete(`/api/medicalRecords/${id}`);
        fetchData();
        showAlert("Medical record deleted successfully", "success");
      } catch (error) {
        console.error("Error deleting record:", error);
        showAlert("Failed to delete medical record", "error");
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom component="div">
        Medical Records Management
      </Typography>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by patient name or diagnosis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <IconButton size="small">
                <SearchIcon />
              </IconButton>
            ),
          }}
          sx={{ width: "300px" }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add New Record
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="medical records table">
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Visit Date</TableCell>
              <TableCell>Diagnosis</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No medical records found
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.patientName}</TableCell>
                  <TableCell>{record.doctorName}</TableCell>
                  <TableCell>
                    {new Date(record.visitDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{record.diagnosis}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(record)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(record.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {formData.id ? "Edit Medical Record" : "Add New Medical Record"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Patient</InputLabel>
                <Select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  label="Patient"
                >
                  {patients.map((patient) => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Doctor</InputLabel>
                <Select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  label="Doctor"
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Visit Date"
                type="date"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diagnosis"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                multiline
                rows={2}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Treatment"
                name="treatment"
                value={formData.treatment}
                onChange={handleChange}
                multiline
                rows={2}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prescription"
                name="prescription"
                value={formData.prescription}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {formData.id ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default MedicalRecordManagement;
