-- Create Database
CREATE DATABASE IF NOT EXISTS rs_igd;
USE rs_igd;

-- Master Data Tables
CREATE TABLE master (
  id_master INT AUTO_INCREMENT PRIMARY KEY,
  nama_master VARCHAR(100),
  jenis_master VARCHAR(50)
);

CREATE TABLE petugas (
  id_petugas INT AUTO_INCREMENT PRIMARY KEY,
  nama_petugas VARCHAR(100),
  no_telp VARCHAR(20),
  pass VARCHAR(100),
  level VARCHAR(50)
);

-- Patient Table
CREATE TABLE pasien (
  id_pasien INT AUTO_INCREMENT PRIMARY KEY,
  no_rm VARCHAR(20),
  nama_pasien VARCHAR(100),
  jns_kelamin VARCHAR(10),
  tgl_lahir DATE,
  no_telp VARCHAR(20),
  nama_ortu VARCHAR(100),
  nama_suami VARCHAR(100),
  nama_kk VARCHAR(100)
);

-- Doctor Table
CREATE TABLE dokter (
  id_dokter INT AUTO_INCREMENT PRIMARY KEY,
  nama_dokter VARCHAR(100),
  pass VARCHAR(100)
);

CREATE TABLE jenis_dokter (
  id_jenis_dokter INT AUTO_INCREMENT PRIMARY KEY,
  jenis_dokter VARCHAR(50)
);

-- Visit Table
CREATE TABLE kunjungan (
  id_kunjungan INT AUTO_INCREMENT PRIMARY KEY,
  id_pasien INT,
  id_dokter INT,
  status VARCHAR(50),
  resep TEXT,
  anamnesa TEXT,
  diagnosa TEXT,
  pemeriksaan TEXT,
  FOREIGN KEY (id_pasien) REFERENCES pasien(id_pasien),
  FOREIGN KEY (id_dokter) REFERENCES dokter(id_dokter)
);

-- Visit Therapy
CREATE TABLE tarif (
  id_tarif INT AUTO_INCREMENT PRIMARY KEY,
  nama_tarif VARCHAR(100)
);

CREATE TABLE tarif_rinci (
  id_tarif_rinci INT AUTO_INCREMENT PRIMARY KEY,
  id_tarif INT,
  baru BOOLEAN,
  lama BOOLEAN,
  jm VARCHAR(50),
  ringan BOOLEAN,
  sedang BOOLEAN,
  berat BOOLEAN,
  FOREIGN KEY (id_tarif) REFERENCES tarif(id_tarif)
);

CREATE TABLE tarif_lama (
  id_tarif_lama INT AUTO_INCREMENT PRIMARY KEY,
  id_tarif INT,
  baru BOOLEAN,
  lama BOOLEAN,
  jm VARCHAR(50),
  ringan BOOLEAN,
  sedang BOOLEAN,
  berat BOOLEAN,
  tanggal DATE,
  FOREIGN KEY (id_tarif) REFERENCES tarif(id_tarif)
);

CREATE TABLE kunjungan_terapi (
  id_k_terapi INT AUTO_INCREMENT PRIMARY KEY,
  id_kunjungan INT,
  id_tarif_rinci INT,
  jenis VARCHAR(50),
  harga DECIMAL(10, 2),
  jumlah INT,
  FOREIGN KEY (id_kunjungan) REFERENCES kunjungan(id_kunjungan),
  FOREIGN KEY (id_tarif_rinci) REFERENCES tarif_rinci(id_tarif_rinci)
);

-- Payment Table
CREATE TABLE bayar (
  id_bayar INT AUTO_INCREMENT PRIMARY KEY,
  id_kunjungan INT,
  no_nota VARCHAR(20),
  administrasi DECIMAL(10,2),
  jasa_dokter DECIMAL(10,2),
  tindakan DECIMAL(10,2),
  obat DECIMAL(10,2),
  ambulans DECIMAL(10,2),
  lainlain DECIMAL(10,2),
  FOREIGN KEY (id_kunjungan) REFERENCES kunjungan(id_kunjungan)
);