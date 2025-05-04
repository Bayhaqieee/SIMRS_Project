import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Divider,
  Typography,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  DollarOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PaymentManagement = () => {
  // State declarations
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [form] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState("all");
  const [statistics, setStatistics] = useState({
    totalPayments: 0,
    pendingPayments: 0,
    completedPayments: 0,
    totalRevenue: 0,
  });
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Mock API URL - replace with your actual API
  const API_URL = "http://localhost:5000/api";

  // Fetch payments data
  const fetchPayments = async () => {
    setLoading(true);
    try {
      // In a real application, you would call your API
      // const response = await axios.get(`${API_URL}/payments`);
      // setPayments(response.data);

      // For demo purposes, using mock data
      const mockData = [
        {
          id: 1,
          patientId: 1,
          patientName: "Budi Santoso",
          doctorId: 1,
          doctorName: "Dr. Adi Pratama",
          visitDate: "2025-05-01",
          amount: 350000,
          paymentMethod: "cash",
          status: "completed",
          notes: "Konsultasi umum",
          createdAt: "2025-05-01 14:30:00",
          services: ["Konsultasi", "Resep Obat"],
        },
        {
          id: 2,
          patientId: 2,
          patientName: "Siti Rahayu",
          doctorId: 2,
          doctorName: "Dr. Dewi Susanti",
          visitDate: "2025-05-02",
          amount: 500000,
          paymentMethod: "transfer",
          status: "pending",
          notes: "Pemeriksaan khusus + obat",
          createdAt: "2025-05-02 10:15:00",
          services: ["Pemeriksaan Khusus", "Resep Obat", "Tindakan Medis"],
        },
        {
          id: 3,
          patientId: 3,
          patientName: "Ahmad Yusuf",
          doctorId: 1,
          doctorName: "Dr. Adi Pratama",
          visitDate: "2025-05-03",
          amount: 275000,
          paymentMethod: "debit",
          status: "completed",
          notes: "Kontrol rutin",
          createdAt: "2025-05-03 16:45:00",
          services: ["Kontrol", "Resep Obat"],
        },
      ];

      setPayments(mockData);

      // Calculate statistics
      setStatistics({
        totalPayments: mockData.length,
        pendingPayments: mockData.filter((p) => p.status === "pending").length,
        completedPayments: mockData.filter((p) => p.status === "completed")
          .length,
        totalRevenue: mockData.reduce((sum, payment) => {
          return payment.status === "completed" ? sum + payment.amount : sum;
        }, 0),
      });
    } catch (error) {
      console.error("Error fetching payments:", error);
      message.error("Gagal memuat data pembayaran");
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients, doctors, and services data
  const fetchReferenceData = async () => {
    try {
      // In a real application, you would call your APIs
      // const patientResponse = await axios.get(`${API_URL}/patients`);
      // const doctorResponse = await axios.get(`${API_URL}/doctors`);
      // const serviceResponse = await axios.get(`${API_URL}/services`);

      // For demo purposes, using mock data
      setPatients([
        { id: 1, name: "Budi Santoso" },
        { id: 2, name: "Siti Rahayu" },
        { id: 3, name: "Ahmad Yusuf" },
        { id: 4, name: "Dewi Lestari" },
      ]);

      setDoctors([
        { id: 1, name: "Dr. Adi Pratama" },
        { id: 2, name: "Dr. Dewi Susanti" },
        { id: 3, name: "Dr. Hendra Wijaya" },
      ]);

      setServices([
        { id: 1, name: "Konsultasi", price: 150000 },
        { id: 2, name: "Pemeriksaan Khusus", price: 300000 },
        { id: 3, name: "Tindakan Medis", price: 200000 },
        { id: 4, name: "Resep Obat", price: 100000 },
        { id: 5, name: "Kontrol", price: 100000 },
      ]);
    } catch (error) {
      console.error("Error fetching reference data:", error);
      message.error("Gagal memuat data referensi");
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchPayments();
    fetchReferenceData();
  }, []);

  // Handle create/edit payment
  const handleSavePayment = async (values) => {
    try {
      if (editingPayment) {
        // In a real application, you would call your API to update
        // await axios.put(`${API_URL}/payments/${editingPayment.id}`, values);

        // For demo purposes, updating local state
        setPayments(
          payments.map((payment) =>
            payment.id === editingPayment.id
              ? { ...payment, ...values }
              : payment
          )
        );

        message.success("Pembayaran berhasil diperbarui");
      } else {
        // In a real application, you would call your API to create
        // const response = await axios.post(`${API_URL}/payments`, values);

        // For demo purposes, adding to local state
        const newPayment = {
          id: payments.length + 1,
          ...values,
          patientName: patients.find((p) => p.id === values.patientId)?.name,
          doctorName: doctors.find((d) => d.id === values.doctorId)?.name,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        };

        setPayments([...payments, newPayment]);

        message.success("Pembayaran berhasil ditambahkan");
      }

      setModalVisible(false);
      form.resetFields();
      setEditingPayment(null);

      // Recalculate statistics
      const updatedPayments = editingPayment
        ? payments.map((payment) =>
            payment.id === editingPayment.id
              ? { ...payment, ...values }
              : payment
          )
        : [
            ...payments,
            {
              id: payments.length + 1,
              ...values,
              createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
          ];

      setStatistics({
        totalPayments: updatedPayments.length,
        pendingPayments: updatedPayments.filter((p) => p.status === "pending")
          .length,
        completedPayments: updatedPayments.filter(
          (p) => p.status === "completed"
        ).length,
        totalRevenue: updatedPayments.reduce((sum, payment) => {
          return payment.status === "completed" ? sum + payment.amount : sum;
        }, 0),
      });
    } catch (error) {
      console.error("Error saving payment:", error);
      message.error("Gagal menyimpan pembayaran");
    }
  };

  // Handle delete payment
  const handleDeletePayment = async (id) => {
    try {
      // In a real application, you would call your API to delete
      // await axios.delete(`${API_URL}/payments/${id}`);

      // For demo purposes, removing from local state
      const updatedPayments = payments.filter((payment) => payment.id !== id);
      setPayments(updatedPayments);

      // Recalculate statistics
      setStatistics({
        totalPayments: updatedPayments.length,
        pendingPayments: updatedPayments.filter((p) => p.status === "pending")
          .length,
        completedPayments: updatedPayments.filter(
          (p) => p.status === "completed"
        ).length,
        totalRevenue: updatedPayments.reduce((sum, payment) => {
          return payment.status === "completed" ? sum + payment.amount : sum;
        }, 0),
      });

      message.success("Pembayaran berhasil dihapus");
    } catch (error) {
      console.error("Error deleting payment:", error);
      message.error("Gagal menghapus pembayaran");
    }
  };

  // Handle payment status change
  const handleStatusChange = async (payment, newStatus) => {
    try {
      // In a real application, you would call your API to update status
      // await axios.patch(`${API_URL}/payments/${payment.id}`, { status: newStatus });

      // For demo purposes, updating local state
      const updatedPayments = payments.map((p) =>
        p.id === payment.id ? { ...p, status: newStatus } : p
      );

      setPayments(updatedPayments);

      // Recalculate statistics
      setStatistics({
        totalPayments: updatedPayments.length,
        pendingPayments: updatedPayments.filter((p) => p.status === "pending")
          .length,
        completedPayments: updatedPayments.filter(
          (p) => p.status === "completed"
        ).length,
        totalRevenue: updatedPayments.reduce((sum, payment) => {
          return payment.status === "completed" ? sum + payment.amount : sum;
        }, 0),
      });

      message.success(
        `Status pembayaran diubah menjadi ${
          newStatus === "completed" ? "Lunas" : "Menunggu"
        }`
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
      message.error("Gagal mengubah status pembayaran");
    }
  };

  // Show receipt modal
  const showReceiptModal = (payment) => {
    setSelectedPayment(payment);
    setReceiptModalVisible(true);
  };

  // Table columns configuration
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Pasien",
      dataIndex: "patientName",
      key: "patientName",
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
    },
    {
      title: "Dokter",
      dataIndex: "doctorName",
      key: "doctorName",
      sorter: (a, b) => a.doctorName.localeCompare(b.doctorName),
    },
    {
      title: "Tanggal Kunjungan",
      dataIndex: "visitDate",
      key: "visitDate",
      render: (text) => moment(text).format("DD/MM/YYYY"),
      sorter: (a, b) => moment(a.visitDate).unix() - moment(b.visitDate).unix(),
    },
    {
      title: "Jumlah (Rp)",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => amount.toLocaleString("id-ID"),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Metode Pembayaran",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => {
        switch (method) {
          case "cash":
            return "Tunai";
          case "debit":
            return "Kartu Debit";
          case "credit":
            return "Kartu Kredit";
          case "transfer":
            return "Transfer Bank";
          default:
            return method;
        }
      },
      filters: [
        { text: "Tunai", value: "cash" },
        { text: "Kartu Debit", value: "debit" },
        { text: "Kartu Kredit", value: "credit" },
        { text: "Transfer Bank", value: "transfer" },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color: status === "completed" ? "#52c41a" : "#faad14",
            fontWeight: "bold",
          }}
        >
          {status === "completed" ? "Lunas" : "Menunggu"}
        </span>
      ),
      filters: [
        { text: "Lunas", value: "completed" },
        { text: "Menunggu", value: "pending" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Tanggal Dibuat",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "Aksi",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingPayment(record);
              form.setFieldsValue({
                ...record,
                visitDate: moment(record.visitDate),
              });
              setModalVisible(true);
            }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeletePayment(record.id)}
          />
          <Button
            type="default"
            icon={<PrinterOutlined />}
            size="small"
            onClick={() => showReceiptModal(record)}
          />
          {record.status === "pending" && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              size="small"
              style={{ background: "#52c41a", borderColor: "#52c41a" }}
              onClick={() => handleStatusChange(record, "completed")}
            >
              Lunasi
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Filtered payments based on status filter
  const filteredPayments =
    filterStatus === "all"
      ? payments
      : payments.filter((payment) => payment.status === filterStatus);

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Manajemen Pembayaran</Title>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Pembayaran"
              value={statistics.totalPayments}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Menunggu Pembayaran"
              value={statistics.pendingPayments}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pembayaran Lunas"
              value={statistics.completedPayments}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Pendapatan"
              value={statistics.totalRevenue}
              precision={0}
              prefix="Rp"
              valueStyle={{ color: "#3f8600" }}
              formatter={(value) => value.toLocaleString("id-ID")}
            />
          </Card>
        </Col>
      </Row>

      {/* Filter and Action Buttons */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Select
            defaultValue="all"
            style={{ width: 200 }}
            onChange={setFilterStatus}
          >
            <Option value="all">Semua Status</Option>
            <Option value="pending">Menunggu Pembayaran</Option>
            <Option value="completed">Pembayaran Lunas</Option>
          </Select>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingPayment(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Tambah Pembayaran Baru
        </Button>
      </div>

      {/* Payment Table */}
      <Table
        columns={columns}
        dataSource={filteredPayments}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Create/Edit Payment Modal */}
      <Modal
        title={editingPayment ? "Edit Pembayaran" : "Tambah Pembayaran Baru"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingPayment(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSavePayment}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="patientId"
                label="Pasien"
                rules={[{ required: true, message: "Pilih pasien" }]}
              >
                <Select placeholder="Pilih pasien">
                  {patients.map((patient) => (
                    <Option key={patient.id} value={patient.id}>
                      {patient.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="doctorId"
                label="Dokter"
                rules={[{ required: true, message: "Pilih dokter" }]}
              >
                <Select placeholder="Pilih dokter">
                  {doctors.map((doctor) => (
                    <Option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="visitDate"
                label="Tanggal Kunjungan"
                rules={[{ required: true, message: "Pilih tanggal kunjungan" }]}
              >
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="services"
                label="Layanan"
                rules={[{ required: true, message: "Pilih layanan" }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Pilih layanan"
                  onChange={(selectedServices) => {
                    const totalAmount = services
                      .filter((service) =>
                        selectedServices.includes(service.name)
                      )
                      .reduce((sum, service) => sum + service.price, 0);

                    form.setFieldsValue({ amount: totalAmount });
                  }}
                >
                  {services.map((service) => (
                    <Option key={service.name} value={service.name}>
                      {service.name} - Rp{" "}
                      {service.price.toLocaleString("id-ID")}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="Jumlah (Rp)"
                rules={[
                  { required: true, message: "Masukkan jumlah pembayaran" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="paymentMethod"
                label="Metode Pembayaran"
                rules={[{ required: true, message: "Pilih metode pembayaran" }]}
              >
                <Select placeholder="Pilih metode pembayaran">
                  <Option value="cash">Tunai</Option>
                  <Option value="debit">Kartu Debit</Option>
                  <Option value="credit">Kartu Kredit</Option>
                  <Option value="transfer">Transfer Bank</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Pilih status pembayaran" }]}
                initialValue="pending"
              >
                <Select placeholder="Pilih status">
                  <Option value="pending">Menunggu</Option>
                  <Option value="completed">Lunas</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="notes" label="Catatan">
                <TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                setModalVisible(false);
                setEditingPayment(null);
                form.resetFields();
              }}
              style={{ marginRight: 8 }}
            >
              Batal
            </Button>
            <Button type="primary" htmlType="submit">
              Simpan
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        title="Detail Kwitansi Pembayaran"
        open={receiptModalVisible}
        onCancel={() => setReceiptModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setReceiptModalVisible(false)}>
            Tutup
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<PrinterOutlined />}
            onClick={() => {
              message.success("Kwitansi dicetak");
              setReceiptModalVisible(false);
            }}
          >
            Cetak
          </Button>,
        ]}
        width={600}
      >
        {selectedPayment && (
          <div style={{ padding: "20px", border: "1px solid #f0f0f0" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Title level={3}>KLINIK SEHAT SEJAHTERA</Title>
              <Text>Jl. Kesehatan No. 123, Jakarta</Text>
              <br />
              <Text>Telp: (021) 1234-5678</Text>
            </div>

            <Divider style={{ marginTop: "10px", marginBottom: "20px" }} />

            <Row style={{ marginBottom: "10px" }}>
              <Col span={12}>
                <Text strong>No. Kwitansi:</Text>{" "}
                {selectedPayment.id.toString().padStart(6, "0")}
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Text strong>Tanggal:</Text>{" "}
                {moment(selectedPayment.createdAt).format("DD/MM/YYYY HH:mm")}
              </Col>
            </Row>

            <Row style={{ marginBottom: "20px" }}>
              <Col span={12}>
                <Text strong>Pasien:</Text> {selectedPayment.patientName}
              </Col>
              <Col span={12}>
                <Text strong>Dokter:</Text> {selectedPayment.doctorName}
              </Col>
            </Row>

            <Divider style={{ marginTop: "10px", marginBottom: "20px" }} />

            <Title level={5}>Detail Layanan</Title>
            <Table
              size="small"
              pagination={false}
              dataSource={selectedPayment.services.map((service, index) => {
                const serviceDetails = services.find((s) => s.name === service);
                return {
                  key: index,
                  name: service,
                  price: serviceDetails?.price || 0,
                };
              })}
              columns={[
                {
                  title: "No",
                  dataIndex: "key",
                  key: "key",
                  render: (key) => key + 1,
                },
                { title: "Layanan", dataIndex: "name", key: "name" },
                {
                  title: "Biaya (Rp)",
                  dataIndex: "price",
                  key: "price",
                  render: (price) => price.toLocaleString("id-ID"),
                  align: "right",
                },
              ]}
              summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell
                      index={0}
                      colSpan={2}
                      style={{ textAlign: "right" }}
                    >
                      <Text strong>Total</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={1}
                      style={{ textAlign: "right" }}
                    >
                      <Text strong>
                        Rp {selectedPayment.amount.toLocaleString("id-ID")}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />

            <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />

            <Row>
              <Col span={12}>
                <Text strong>Metode Pembayaran:</Text>{" "}
                {selectedPayment.paymentMethod === "cash"
                  ? "Tunai"
                  : selectedPayment.paymentMethod === "debit"
                  ? "Kartu Debit"
                  : selectedPayment.paymentMethod === "credit"
                  ? "Kartu Kredit"
                  : selectedPayment.paymentMethod === "transfer"
                  ? "Transfer Bank"
                  : selectedPayment.paymentMethod}
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Text strong>Status:</Text>{" "}
                <span
                  style={{
                    color:
                      selectedPayment.status === "completed"
                        ? "#52c41a"
                        : "#faad14",
                    fontWeight: "bold",
                  }}
                >
                  {selectedPayment.status === "completed"
                    ? "LUNAS"
                    : "MENUNGGU"}
                </span>
              </Col>
            </Row>

            {selectedPayment.notes && (
              <>
                <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />
                <Text strong>Catatan:</Text>
                <p>{selectedPayment.notes}</p>
              </>
            )}

            <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />

            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <Text>Terima kasih atas kunjungan Anda</Text>
              <br />
              <Text>Semoga lekas sembuh</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentManagement;
