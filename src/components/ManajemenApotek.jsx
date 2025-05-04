import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  message,
  Space,
  Popconfirm,
  Tabs,
  Tag,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  WarningOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

const ManajemenApotek = () => {
  // States for medications
  const [medications, setMedications] = useState([]);
  const [medicationLoading, setMedicationLoading] = useState(false);
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);
  const [medicationForm] = Form.useForm();
  const [editingMedicationId, setEditingMedicationId] = useState(null);

  // States for inventory
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryModalVisible, setInventoryModalVisible] = useState(false);
  const [inventoryForm] = Form.useForm();
  const [editingInventoryId, setEditingInventoryId] = useState(null);

  // States for prescriptions
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionModalVisible, setPrescriptionModalVisible] =
    useState(false);
  const [prescriptionForm] = Form.useForm();
  const [editingPrescriptionId, setEditingPrescriptionId] = useState(null);
  const [selectedMedications, setSelectedMedications] = useState([]);

  // States for dropdown data
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Fetch medications data
  const fetchMedications = async () => {
    setMedicationLoading(true);
    try {
      const response = await axios.get("/api/medications");
      setMedications(response.data);
    } catch (error) {
      console.error("Error fetching medications:", error);
      message.error("Gagal memuat data obat");
    } finally {
      setMedicationLoading(false);
    }
  };

  // Fetch inventory data
  const fetchInventory = async () => {
    setInventoryLoading(true);
    try {
      const response = await axios.get("/api/inventory");
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      message.error("Gagal memuat data inventaris");
    } finally {
      setInventoryLoading(false);
    }
  };

  // Fetch prescriptions data
  const fetchPrescriptions = async () => {
    setPrescriptionLoading(true);
    try {
      const response = await axios.get("/api/prescriptions");
      setPrescriptions(response.data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      message.error("Gagal memuat data resep");
    } finally {
      setPrescriptionLoading(false);
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
    fetchMedications();
    fetchInventory();
    fetchPrescriptions();
    fetchRelatedData();
  }, []);

  // Handle medication form submission
  const handleMedicationSubmit = async (values) => {
    try {
      if (editingMedicationId) {
        await axios.put(`/api/medications/${editingMedicationId}`, values);
        message.success("Data obat berhasil diperbarui");
      } else {
        await axios.post("/api/medications", values);
        message.success("Data obat berhasil ditambahkan");
      }
      setMedicationModalVisible(false);
      medicationForm.resetFields();
      setEditingMedicationId(null);
      fetchMedications();
      fetchInventory(); // Refresh inventory as it might be affected
    } catch (error) {
      console.error("Error submitting medication form:", error);
      message.error("Gagal menyimpan data obat");
    }
  };

  // Handle inventory form submission
  const handleInventorySubmit = async (values) => {
    try {
      if (editingInventoryId) {
        await axios.put(`/api/inventory/${editingInventoryId}`, values);
        message.success("Data inventaris berhasil diperbarui");
      } else {
        await axios.post("/api/inventory", values);
        message.success("Data inventaris berhasil ditambahkan");
      }
      setInventoryModalVisible(false);
      inventoryForm.resetFields();
      setEditingInventoryId(null);
      fetchInventory();
    } catch (error) {
      console.error("Error submitting inventory form:", error);
      message.error("Gagal menyimpan data inventaris");
    }
  };

  // Handle prescription form submission
  const handlePrescriptionSubmit = async (values) => {
    try {
      const prescriptionData = {
        ...values,
        medications: selectedMedications,
        date: values.date.format("YYYY-MM-DD"),
      };

      if (editingPrescriptionId) {
        await axios.put(
          `/api/prescriptions/${editingPrescriptionId}`,
          prescriptionData
        );
        message.success("Data resep berhasil diperbarui");
      } else {
        await axios.post("/api/prescriptions", prescriptionData);
        message.success("Data resep berhasil ditambahkan");
      }
      setPrescriptionModalVisible(false);
      prescriptionForm.resetFields();
      setEditingPrescriptionId(null);
      setSelectedMedications([]);
      fetchPrescriptions();
      fetchInventory(); // Refresh inventory as it might be affected
    } catch (error) {
      console.error("Error submitting prescription form:", error);
      message.error("Gagal menyimpan data resep");
    }
  };

  // Delete medication
  const handleDeleteMedication = async (id) => {
    try {
      await axios.delete(`/api/medications/${id}`);
      message.success("Data obat berhasil dihapus");
      fetchMedications();
    } catch (error) {
      console.error("Error deleting medication:", error);
      message.error("Gagal menghapus data obat");
    }
  };

  // Delete inventory item
  const handleDeleteInventory = async (id) => {
    try {
      await axios.delete(`/api/inventory/${id}`);
      message.success("Data inventaris berhasil dihapus");
      fetchInventory();
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      message.error("Gagal menghapus data inventaris");
    }
  };

  // Delete prescription
  const handleDeletePrescription = async (id) => {
    try {
      await axios.delete(`/api/prescriptions/${id}`);
      message.success("Data resep berhasil dihapus");
      fetchPrescriptions();
    } catch (error) {
      console.error("Error deleting prescription:", error);
      message.error("Gagal menghapus data resep");
    }
  };

  // Edit medication
  const handleEditMedication = (record) => {
    setEditingMedicationId(record.id);
    medicationForm.setFieldsValue({
      ...record,
      expiryDate: record.expiryDate ? moment(record.expiryDate) : null,
    });
    setMedicationModalVisible(true);
  };

  // Edit inventory item
  const handleEditInventory = (record) => {
    setEditingInventoryId(record.id);
    inventoryForm.setFieldsValue({
      ...record,
      purchaseDate: record.purchaseDate ? moment(record.purchaseDate) : null,
    });
    setInventoryModalVisible(true);
  };

  // Edit prescription
  const handleEditPrescription = (record) => {
    setEditingPrescriptionId(record.id);
    setSelectedMedications(record.medications || []);
    prescriptionForm.setFieldsValue({
      ...record,
      date: record.date ? moment(record.date) : null,
    });
    setPrescriptionModalVisible(true);
  };

  // Add medication to prescription
  const handleAddMedicationToPrescription = () => {
    const medicationId = prescriptionForm.getFieldValue("medicationId");
    const dosage = prescriptionForm.getFieldValue("dosage");
    const frequency = prescriptionForm.getFieldValue("frequency");
    const duration = prescriptionForm.getFieldValue("duration");

    if (!medicationId || !dosage || !frequency || !duration) {
      message.error("Lengkapi semua informasi obat");
      return;
    }

    const selectedMedication = medications.find(
      (med) => med.id === medicationId
    );
    if (!selectedMedication) {
      message.error("Obat tidak ditemukan");
      return;
    }

    const newMedication = {
      id: medicationId,
      name: selectedMedication.name,
      dosage,
      frequency,
      duration,
    };

    setSelectedMedications([...selectedMedications, newMedication]);

    // Reset medication fields
    prescriptionForm.setFieldsValue({
      medicationId: undefined,
      dosage: undefined,
      frequency: undefined,
      duration: undefined,
    });
  };

  // Remove medication from prescription
  const handleRemoveMedicationFromPrescription = (index) => {
    const updatedMedications = [...selectedMedications];
    updatedMedications.splice(index, 1);
    setSelectedMedications(updatedMedications);
  };

  // Reset medication form and close modal
  const handleMedicationCancel = () => {
    medicationForm.resetFields();
    setMedicationModalVisible(false);
    setEditingMedicationId(null);
  };

  // Reset inventory form and close modal
  const handleInventoryCancel = () => {
    inventoryForm.resetFields();
    setInventoryModalVisible(false);
    setEditingInventoryId(null);
  };

  // Reset prescription form and close modal
  const handlePrescriptionCancel = () => {
    prescriptionForm.resetFields();
    setPrescriptionModalVisible(false);
    setEditingPrescriptionId(null);
    setSelectedMedications([]);
  };

  // Medication table columns
  const medicationColumns = [
    {
      title: "Kode Obat",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Nama Obat",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      width: 150,
    },
    {
      title: "Bentuk",
      dataIndex: "form",
      key: "form",
      width: 120,
    },
    {
      title: "Dosis Standar",
      dataIndex: "standardDosage",
      key: "standardDosage",
      width: 150,
    },
    {
      title: "Harga (Rp)",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price) => price.toLocaleString("id-ID"),
    },
    {
      title: "Tanggal Kadaluarsa",
      dataIndex: "expiryDate",
      key: "expiryDate",
      width: 150,
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "-"),
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
            onClick={() => handleEditMedication(record)}
          />
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            onConfirm={() => handleDeleteMedication(record.id)}
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

  // Inventory table columns
  const inventoryColumns = [
    {
      title: "Obat",
      dataIndex: "medicationName",
      key: "medicationName",
      width: 200,
    },
    {
      title: "Jumlah Stok",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      render: (quantity, record) => (
        <span
          style={{
            color: quantity <= record.minimumStock ? "red" : "inherit",
            fontWeight: quantity <= record.minimumStock ? "bold" : "normal",
          }}
        >
          {quantity}
          {quantity <= record.minimumStock && (
            <WarningOutlined style={{ marginLeft: 8, color: "red" }} />
          )}
        </span>
      ),
    },
    {
      title: "Stok Minimum",
      dataIndex: "minimumStock",
      key: "minimumStock",
      width: 140,
    },
    {
      title: "Batch",
      dataIndex: "batchNumber",
      key: "batchNumber",
      width: 120,
    },
    {
      title: "Lokasi",
      dataIndex: "location",
      key: "location",
      width: 120,
    },
    {
      title: "Tanggal Pembelian",
      dataIndex: "purchaseDate",
      key: "purchaseDate",
      width: 150,
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag
          color={
            status === "Tersedia"
              ? "green"
              : status === "Hampir Habis"
              ? "orange"
              : status === "Habis"
              ? "red"
              : "blue"
          }
        >
          {status}
        </Tag>
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
            onClick={() => handleEditInventory(record)}
          />
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            onConfirm={() => handleDeleteInventory(record.id)}
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

  // Prescription table columns
  const prescriptionColumns = [
    {
      title: "No. Resep",
      dataIndex: "prescriptionNumber",
      key: "prescriptionNumber",
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
      title: "Tanggal",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Jumlah Obat",
      dataIndex: "medications",
      key: "medicationCount",
      width: 120,
      render: (medications) => (medications ? medications.length : 0),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag
          color={
            status === "Menunggu"
              ? "orange"
              : status === "Diproses"
              ? "blue"
              : status === "Selesai"
              ? "green"
              : "red"
          }
        >
          {status}
        </Tag>
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
            onClick={() => handleEditPrescription(record)}
          />
          <Popconfirm
            title="Apakah Anda yakin ingin menghapus data ini?"
            onConfirm={() => handleDeletePrescription(record.id)}
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
    <div className="manajemen-apotek-container">
      <div className="page-header">
        <h1>Manajemen Apotek</h1>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <MedicineBoxOutlined />
              Data Obat
            </span>
          }
          key="1"
        >
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Input
                placeholder="Cari obat..."
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
              />
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setMedicationModalVisible(true)}
            >
              Tambah Obat
            </Button>
          </div>

          <Table
            columns={medicationColumns}
            dataSource={medications}
            rowKey="id"
            loading={medicationLoading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />

          <Modal
            title={
              editingMedicationId ? "Edit Data Obat" : "Tambah Data Obat Baru"
            }
            visible={medicationModalVisible}
            onCancel={handleMedicationCancel}
            footer={null}
            width={800}
          >
            <Form
              form={medicationForm}
              layout="vertical"
              onFinish={handleMedicationSubmit}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <Form.Item
                  name="code"
                  label="Kode Obat"
                  rules={[
                    { required: true, message: "Kode obat wajib diisi!" },
                  ]}
                >
                  <Input placeholder="Masukkan kode obat" />
                </Form.Item>

                <Form.Item
                  name="name"
                  label="Nama Obat"
                  rules={[
                    { required: true, message: "Nama obat wajib diisi!" },
                  ]}
                >
                  <Input placeholder="Masukkan nama obat" />
                </Form.Item>

                <Form.Item
                  name="category"
                  label="Kategori"
                  rules={[
                    { required: true, message: "Kategori wajib dipilih!" },
                  ]}
                >
                  <Select placeholder="Pilih kategori">
                    <Option value="Antibiotik">Antibiotik</Option>
                    <Option value="Analgesik">Analgesik</Option>
                    <Option value="Antipiretik">Antipiretik</Option>
                    <Option value="Antidiabetes">Antidiabetes</Option>
                    <Option value="Antihipertensi">Antihipertensi</Option>
                    <Option value="Vitamin">Vitamin</Option>
                    <Option value="Lainnya">Lainnya</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="form"
                  label="Bentuk"
                  rules={[
                    { required: true, message: "Bentuk obat wajib dipilih!" },
                  ]}
                >
                  <Select placeholder="Pilih bentuk obat">
                    <Option value="Tablet">Tablet</Option>
                    <Option value="Kapsul">Kapsul</Option>
                    <Option value="Sirup">Sirup</Option>
                    <Option value="Suntik">Suntik</Option>
                    <Option value="Salep">Salep</Option>
                    <Option value="Tetes">Tetes</Option>
                    <Option value="Lainnya">Lainnya</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="standardDosage" label="Dosis Standar">
                  <Input placeholder="Contoh: 500mg, 5ml, dsb" />
                </Form.Item>

                <Form.Item
                  name="price"
                  label="Harga (Rp)"
                  rules={[{ required: true, message: "Harga wajib diisi!" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    }
                    parser={(value) => value.replace(/\./g, "")}
                    placeholder="Masukkan harga"
                  />
                </Form.Item>

                <Form.Item name="expiryDate" label="Tanggal Kadaluarsa">
                  <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item name="manufacturer" label="Produsen">
                  <Input placeholder="Masukkan nama produsen" />
                </Form.Item>
              </div>

              <Form.Item name="description" label="Deskripsi">
                <Input.TextArea
                  rows={4}
                  placeholder="Masukkan deskripsi obat"
                />
              </Form.Item>

              <Form.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                  }}
                >
                  <Button onClick={handleMedicationCancel}>Batal</Button>
                  <Button type="primary" htmlType="submit">
                    {editingMedicationId ? "Perbarui" : "Simpan"}
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </TabPane>

        <TabPane
          tab={
            <span>
              <SearchOutlined />
              Inventaris
            </span>
          }
          key="2"
        >
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Input
                placeholder="Cari inventaris..."
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
              />
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setInventoryModalVisible(true)}
            >
              Tambah Inventaris
            </Button>
          </div>

          <Table
            columns={inventoryColumns}
            dataSource={inventory}
            rowKey="id"
            loading={inventoryLoading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />

          <Modal
            title={
              editingInventoryId
                ? "Edit Data Inventaris"
                : "Tambah Data Inventaris Baru"
            }
            visible={inventoryModalVisible}
            onCancel={handleInventoryCancel}
            footer={null}
            width={800}
          >
            <Form
              form={inventoryForm}
              layout="vertical"
              onFinish={handleInventorySubmit}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <Form.Item
                  name="medicationId"
                  label="Obat"
                  rules={[{ required: true, message: "Obat wajib dipilih!" }]}
                >
                  <Select
                    placeholder="Pilih obat"
                    showSearch
                    optionFilterProp="children"
                  >
                    {medications.map((medication) => (
                      <Option key={medication.id} value={medication.id}>
                        {medication.name} ({medication.code})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="quantity"
                  label="Jumlah Stok"
                  rules={[
                    { required: true, message: "Jumlah stok wajib diisi!" },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="Masukkan jumlah stok"
                  />
                </Form.Item>

                <Form.Item
                  name="minimumStock"
                  label="Stok Minimum"
                  rules={[
                    { required: true, message: "Stok minimum wajib diisi!" },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="Masukkan stok minimum"
                  />
                </Form.Item>

                <Form.Item name="batchNumber" label="Nomor Batch">
                  <Input placeholder="Masukkan nomor batch" />
                </Form.Item>

                <Form.Item name="location" label="Lokasi">
                  <Input placeholder="Masukkan lokasi penyimpanan" />
                </Form.Item>

                <Form.Item name="purchaseDate" label="Tanggal Pembelian">
                  <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: "Status wajib dipilih!" }]}
                >
                  <Select placeholder="Pilih status">
                    <Option value="Tersedia">Tersedia</Option>
                    <Option value="Hampir Habis">Hampir Habis</Option>
                    <Option value="Habis">Habis</Option>
                    <Option value="Kadaluarsa">Kadaluarsa</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="supplier" label="Supplier">
                  <Input placeholder="Masukkan nama supplier" />
                </Form.Item>
              </div>

              <Form.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                  }}
                >
                  <Button onClick={handleInventoryCancel}>Batal</Button>
                  <Button type="primary" htmlType="submit">
                    {editingInventoryId ? "Perbarui" : "Simpan"}
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </TabPane>

        <TabPane
          tab={
            <span>
              <SearchOutlined />
              Resep
            </span>
          }
          key="3"
        >
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Input
                placeholder="Cari resep..."
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
              />
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setPrescriptionModalVisible(true)}
            >
              Tambah Resep
            </Button>
          </div>

          <Table
            columns={prescriptionColumns}
            dataSource={prescriptions}
            rowKey="id"
            loading={prescriptionLoading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />

          <Modal
            title={
              editingPrescriptionId
                ? "Edit Data Resep"
                : "Tambah Data Resep Baru"
            }
            visible={prescriptionModalVisible}
            onCancel={handlePrescriptionCancel}
            footer={null}
            width={800}
          >
            <Form
              form={prescriptionForm}
              layout="vertical"
              onFinish={handlePrescriptionSubmit}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <Form.Item
                  name="prescriptionNumber"
                  label="Nomor Resep"
                  rules={[
                    { required: true, message: "Nomor resep wajib diisi!" },
                  ]}
                >
                  <Input placeholder="Masukkan nomor resep" />
                </Form.Item>

                <Form.Item
                  name="date"
                  label="Tanggal"
                  rules={[{ required: true, message: "Tanggal wajib diisi!" }]}
                >
                  <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item
                  name="patientId"
                  label="Pasien"
                  rules={[{ required: true, message: "Pasien wajib dipilih!" }]}
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
                  rules={[{ required: true, message: "Dokter wajib dipilih!" }]}
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
              </div>

              <div
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "16px",
                }}
              >
                <Text strong>Tambah Obat ke Resep</Text>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  <Form.Item name="medicationId" style={{ margin: 0 }}>
                    <Select
                      placeholder="Pilih obat"
                      showSearch
                      optionFilterProp="children"
                    >
                      {medications.map((medication) => (
                        <Option key={medication.id} value={medication.id}>
                          {medication.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item name="dosage" style={{ margin: 0 }}>
                    <Input placeholder="Dosis (cth: 1 tablet)" />
                  </Form.Item>

                  <Form.Item name="frequency" style={{ margin: 0 }}>
                    <Input placeholder="Frekuensi (cth: 3x sehari)" />
                  </Form.Item>

                  <Form.Item name="duration" style={{ margin: 0 }}>
                    <Input placeholder="Durasi (cth: 7 hari)" />
                  </Form.Item>

                  <Button
                    type="primary"
                    onClick={handleAddMedicationToPrescription}
                  >
                    Tambah
                  </Button>
                </div>

                {selectedMedications.length > 0 && (
                  <div style={{ marginTop: "16px" }}>
                    <Text strong>Daftar Obat:</Text>
                    <ul style={{ marginTop: "8px" }}>
                      {selectedMedications.map((med, index) => (
                        <li key={index} style={{ marginBottom: "8px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              <strong>{med.name}</strong> - {med.dosage},{" "}
                              {med.frequency}, {med.duration}
                            </div>
                            <Button
                              type="text"
                              danger
                              size="small"
                              onClick={() =>
                                handleRemoveMedicationFromPrescription(index)
                              }
                            >
                              Hapus
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Form.Item name="notes" label="Catatan">
                <Input.TextArea rows={4} placeholder="Masukkan catatan" />
              </Form.Item>

              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Status wajib dipilih!" }]}
              >
                <Select placeholder="Pilih status">
                  <Option value="Menunggu">Menunggu</Option>
                  <Option value="Diproses">Diproses</Option>
                  <Option value="Selesai">Selesai</Option>
                  <Option value="Dibatalkan">Dibatalkan</Option>
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
                  <Button onClick={handlePrescriptionCancel}>Batal</Button>
                  <Button type="primary" htmlType="submit">
                    {editingPrescriptionId ? "Perbarui" : "Simpan"}
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </TabPane>
      </Tabs>
    </div>
  );
};
export default ManajemenApotek;
