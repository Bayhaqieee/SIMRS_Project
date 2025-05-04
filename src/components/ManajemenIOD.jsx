import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Space,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const ManajemenIOD = () => {
  const [iodData, setIodData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Fetch IOD data
  const fetchIODData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/iod");
      setIodData(response.data);
    } catch (error) {
      console.error("Error fetching IOD data:", error);
      message.error("Gagal memuat data IOD");
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients and doctors for dropdowns
  const fetchRelatedData = async () => {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        axios.get("/api/patients"),
        axios.get("/api/doctors"),
      ]);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
    } catch (error) {
      console.error("Error fetching related data:", error);
      message.error("Gagal memuat data pasien atau dokter");
    }
  };

  useEffect(() => {
    fetchIODData();
    fetchRelatedData();
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await axios.put(`/api/iod/${editingId}`, values);
        message.success("Data IOD berhasil diperbarui");
      } else {
        await axios.post("/api/iod", values);
        message.success("Data IOD berhasil ditambahkan");
      }
      setModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchIODData();
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Gagal menyimpan data IOD");
    }
  };

  // Delete IOD record
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/iod/${id}`);
      message.success("Data IOD berhasil dihapus");
      fetchIODData();
    } catch (error) {
      console.error("Error deleting IOD:", error);
      message.error("Gagal menghapus data IOD");
    }
  };

  // Edit IOD record
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      admissionDate: record.admissionDate ? moment(record.admissionDate) : null,
      dischargeDate: record.dischargeDate ? moment(record.dischargeDate) : null,
    });
    setModalVisible(true);
  };

  // Reset form and close modal
  const handleCancel = () => {
    form.resetFields();
    setModalVisible(false);
    setEditingId(null);
  };

  // Table columns
  const columns = [
    {
      title: "No. IOD",
      dataIndex: "iodNumber",
      key: "iodNumber",
      width: 120,
    },
    {
      title: "Pasien",
      dataIndex: "patientName",
      key: "patientName",
      width: 180,
    },
    {
      title: "Dokter",
      dataIndex: "doctorName",
      key: "doctorName",
      width: 180,
    },
    {
      title: "Tanggal Masuk",
      dataIndex: "admissionDate",
      key: "admissionDate",
      width: 120,
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Tanggal Keluar",
      dataIndex: "dischargeDate",
      key: "dischargeDate",
      width: 120,
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Diagnosa",
      dataIndex: "diagnosis",
      key: "diagnosis",
      width: 200,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <span
          style={{
            color:
              status === "Dirawat"
                ? "blue"
                : status === "Dipulangkan"
                ? "green"
                : "orange",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Aksi",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              danger
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="manajemen-iod-container">
      <div className="page-header">
        <h1>Manajemen IOD (Instruksi Observasi Dokter)</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Tambah IOD
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={iodData}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingId ? "Edit Data IOD" : "Tambah Data IOD Baru"}
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="iodNumber"
            label="Nomor IOD"
            rules={[{ required: true, message: "Nomor IOD wajib diisi!" }]}
          >
            <Input placeholder="Masukkan nomor IOD" />
          </Form.Item>

          <Form.Item
            name="patientId"
            label="Pasien"
            rules={[{ required: true, message: "Pilih pasien!" }]}
          >
            <Select
              placeholder="Pilih pasien"
              showSearch
              optionFilterProp="children"
            >
              {patients.map((patient) => (
                <Option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.medicalRecordNumber})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="doctorId"
            label="Dokter"
            rules={[{ required: true, message: "Pilih dokter!" }]}
          >
            <Select
              placeholder="Pilih dokter"
              showSearch
              optionFilterProp="children"
            >
              {doctors.map((doctor) => (
                <Option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="admissionDate"
            label="Tanggal Masuk"
            rules={[{ required: true, message: "Tanggal masuk wajib diisi!" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="dischargeDate" label="Tanggal Keluar">
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="diagnosis"
            label="Diagnosa"
            rules={[{ required: true, message: "Diagnosa wajib diisi!" }]}
          >
            <Input.TextArea rows={4} placeholder="Masukkan diagnosa" />
          </Form.Item>

          <Form.Item name="treatment" label="Pengobatan/Tindakan">
            <Input.TextArea
              rows={4}
              placeholder="Masukkan pengobatan atau tindakan"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Status wajib dipilih!" }]}
          >
            <Select placeholder="Pilih status">
              <Option value="Dirawat">Dirawat</Option>
              <Option value="Dipulangkan">Dipulangkan</Option>
              <Option value="Rujuk">Rujuk</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button onClick={handleCancel}>Batal</Button>
              <Button type="primary" htmlType="submit">
                {editingId ? "Perbarui" : "Simpan"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManajemenIOD;
