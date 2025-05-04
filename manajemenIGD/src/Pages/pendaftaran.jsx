import { useState } from 'react';
import './pendaftaran.css';

export default function IGDRegistrationForm() {
  const [formData, setFormData] = useState({
    no_rm: '',
    nama_pasien: '',
    id_jenisKelamin: '',
    id_nikah: '',
    id_pekerjaan: '',
    tgl_lahir: '',
    alamat: '',
    no_telp: '',
    nama_ortu: '',
    nama_suami: '',
    status: 'Baru', 
    resep: '',
    anamnesa: '',
    pemeriksaan: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState({ status: '', message: '' });

  const jenisKelaminOptions = [
    { id: '1', label: 'Laki-laki' },
    { id: '2', label: 'Perempuan' }
  ];

  const statusNikahOptions = [
    { id: '1', label: 'Belum Menikah' },
    { id: '2', label: 'Menikah' },
    { id: '3', label: 'Cerai' }
  ];

  const pekerjaanOptions = [
    { id: '1', label: 'PNS' },
    { id: '2', label: 'Swasta' },
    { id: '3', label: 'Wiraswasta' },
    { id: '4', label: 'Pelajar/Mahasiswa' },
    { id: '5', label: 'Tidak Bekerja' },
    { id: '6', label: 'Lainnya' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {

      if (!formData.no_rm) {
        const randomRM = Math.floor(10000 + Math.random() * 90000).toString();
        setFormData(prev => ({ ...prev, no_rm: randomRM }));
      }
      
      setIsSubmitting(false);
      setSubmitResult({
        status: 'success',
        message: 'Pendaftaran pasien berhasil! Nomor RM: ' + (formData.no_rm || Math.floor(10000 + Math.random() * 90000))
      });

      if (submitResult.status === 'success') {
        setFormData({
          no_rm: '',
          nama_pasien: '',
          id_jenisKelamin: '',
          id_nikah: '',
          id_pekerjaan: '',
          tgl_lahir: '',
          alamat: '',
          no_telp: '',
          nama_ortu: '',
          nama_suami: '',
          status: 'Baru',
          resep: '',
          anamnesa: '',
          pemeriksaan: ''
        });
      }
    }, 1500);
  };

  return (
    <div className="registration-container">
      <h1 className="form-title">Sistem Manajemen IGD - Pendaftaran Pasien</h1>
      
      {submitResult.status && (
        <div className={`notification ${submitResult.status === 'success' ? 'success' : 'error'}`}>
          {submitResult.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Nomor Rekam Medis (RM)</label>
            <input
              type="text"
              name="no_rm"
              value={formData.no_rm}
              onChange={handleChange}
              placeholder="Otomatis jika kosong"
              maxLength={10}
            />
          </div>
          
          <div className="form-group">
            <label>Nama Pasien</label>
            <input
              type="text"
              name="nama_pasien"
              value={formData.nama_pasien}
              onChange={handleChange}
              required
              maxLength={30}
            />
          </div>
          
          <div className="form-group">
            <label>Jenis Kelamin</label>
            <select
              name="id_jenisKelamin"
              value={formData.id_jenisKelamin}
              onChange={handleChange}
              required
            >
              <option value="">Pilih</option>
              {jenisKelaminOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Status Pernikahan</label>
            <select
              name="id_nikah"
              value={formData.id_nikah}
              onChange={handleChange}
              required
            >
              <option value="">Pilih</option>
              {statusNikahOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Pekerjaan</label>
            <select
              name="id_pekerjaan"
              value={formData.id_pekerjaan}
              onChange={handleChange}
              required
            >
              <option value="">Pilih</option>
              {pekerjaanOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Tanggal Lahir</label>
            <input
              type="date"
              name="tgl_lahir"
              value={formData.tgl_lahir}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group full-width">
            <label>Alamat</label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              rows="2"
              required
              maxLength={500}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Nomor Telepon</label>
            <input
              type="tel"
              name="no_telp"
              value={formData.no_telp}
              onChange={handleChange}
              required
              maxLength={20}
            />
          </div>
          
          <div className="form-group">
            <label>Nama Orang Tua</label>
            <input
              type="text"
              name="nama_ortu"
              value={formData.nama_ortu}
              onChange={handleChange}
              maxLength={30}
            />
          </div>
          
          <div className="form-group">
            <label>Nama Suami/Istri</label>
            <input
              type="text"
              name="nama_suami"
              value={formData.nama_suami}
              onChange={handleChange}
              maxLength={100}
            />
          </div>
          
          <div className="form-group full-width">
            <label>Anamnesa</label>
            <textarea
              name="anamnesa"
              value={formData.anamnesa}
              onChange={handleChange}
              rows="3"
              required
              placeholder="Keluhan dan riwayat penyakit"
            ></textarea>
          </div>
          
          <div className="form-group full-width">
            <label>Pemeriksaan</label>
            <textarea
              name="pemeriksaan"
              value={formData.pemeriksaan}
              onChange={handleChange}
              rows="3"
              placeholder="Hasil pemeriksaan awal"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Resep</label>
            <input
              type="text"
              name="resep"
              value={formData.resep}
              onChange={handleChange}
              placeholder="Resep awal jika ada"
              maxLength={500}
            />
          </div>
          
          <div className="form-group">
            <label>Status Kunjungan</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Baru">Baru</option>
              <option value="Lama">Lama</option>
              <option value="Rujukan">Rujukan</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className={isSubmitting ? 'btn-submit loading' : 'btn-submit'}
          >
            {isSubmitting ? 'Memproses...' : 'Daftar Pasien'}
          </button>
        </div>
      </form>
    </div>
  );
}