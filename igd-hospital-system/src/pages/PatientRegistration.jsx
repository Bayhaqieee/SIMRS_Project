import React, { useState } from 'react';
import axios from 'axios';

await axios.post('http://localhost:5000/api/pasien', {
  nama_pasien: 'Siti Aminah',
  no_rm: 'IGD2025001',
  jns_kelamin: 'Perempuan',
  tgl_lahir: '1995-07-15',
  no_telp: '08123456789',
  nama_ortu: 'Sri Resti',
  nama_suami: 'Yanto Sutrisno',
  nama_kk: 'Buk Aminah'
});

const PasienRegistration = () => {
  const [formData, setFormData] = useState({
    nama_pasien: '',
    no_rm: '',
    jns_kelamin: '',
    tgl_lahir: '',
    no_telp: '',
    nama_ortu: '',
    nama_suami: '',
    nama_kk: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/pasien', formData);
    alert('Pasien registered!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nama_pasien" onChange={handleChange} placeholder="Nama Pasien" />
      <input name="no_rm" onChange={handleChange} placeholder="No RM" />
      <input name="jns_kelamin" onChange={handleChange} placeholder="Jenis Kelamin" />
      <input type="date" name="tgl_lahir" onChange={handleChange} />
      <input name="no_telp" onChange={handleChange} placeholder="No Telp" />
      <input name="nama_ortu" onChange={handleChange} placeholder="Nama Ortu" />
      <input name="nama_suami" onChange={handleChange} placeholder="Nama Suami/Istri" />
      <input name="nama_kk" onChange={handleChange} placeholder="Nama KK" />
      <button type="submit">Register</button>
    </form>
  );
};

export default PasienRegistration;