import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import pages
import PatientRegistration from './pages/PatientRegistration';
import DoctorExam from './pages/DoctorExam';
import SupportExam from './pages/SupportExam';
import Billing from './pages/Billing';
import Pharmacy from './pages/Pharmacy';
import InpatientReferral from './pages/InpatientReferral';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientRegistration />} />
        <Route path="/exam" element={<DoctorExam />} />
        <Route path="/support-exam" element={<SupportExam />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/inpatient-referral" element={<InpatientReferral />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
