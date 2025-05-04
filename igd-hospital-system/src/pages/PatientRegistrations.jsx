import React, { useState } from 'react';

const PatientRegistration = () => {
  const [patient, setPatient] = useState({
    nama_pasien: '',
    no_rm: '',
    no_telp: ''
  });

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // call your backend API here (axios or fetch)
    console.log(patient);
  };

  return (
    <div>
      <h1>Registrasi Pasien IGD</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nama_pasien" placeholder="Nama Pasien" onChange={handleChange} />
        <input type="text" name="no_rm" placeholder="Nomor RM" onChange={handleChange} />
        <input type="text" name="no_telp" placeholder="Nomor Telepon" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PatientRegistration;