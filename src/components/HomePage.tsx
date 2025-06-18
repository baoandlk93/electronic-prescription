"use client";
import { useState, useEffect } from "react";
import { Button, Card, List, Statistic, Row, Col, Modal } from "antd";
import AddPatientForm from "@/components/AddPatientForm";
import AddMedicineForm from "@/components/AddMedicineForm";
import PrescriptionForm from "@/components/PrescriptionForm";
import { Prescription } from "@/types/Prescription";
import dayjs from "dayjs";

export default function HomePage() {
  const [openPatientModal, setOpenPatientModal] = useState(false);
  const [openMedicineModal, setOpenMedicineModal] = useState(false);
  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);
  const [recentPrescriptions, setRecentPrescriptions] = useState<
    Prescription[]
  >([]);
  const [countPrescriptionToday, setCountPrescriptionToday] = useState(0);
  const [countPatientToday, setCountPatientToday] = useState(0);
  const [countMedicine, setCountMedicine] = useState(0);

  useEffect(() => {
    fetchRecentPrescriptions();
    fetchCountPrescriptionToday();
    fetchCountPatientToday();
    fetchCountMedicine();
  }, []);

  const fetchRecentPrescriptions = async () => {
    const response = await fetch("/api/prescriptions?limit=5");
    const data = await response.json();
    setRecentPrescriptions(data);
  };

  const fetchCountPrescriptionToday = async () => {
    const response = await fetch("/api/prescriptions/count-today");
    const data = await response.json();
    setCountPrescriptionToday(data.count);
  };

  const fetchCountPatientToday = async () => {
    const response = await fetch("/api/patients/count-today");
    const data = await response.json();
    console.log(data);
    setCountPatientToday(data.count);
  };

  const fetchCountMedicine = async () => {
    const response = await fetch("/api/medicines/count");
    const data = await response.json();
    setCountMedicine(data.count);
  };

  return (
    <div className="flex flex-col px-16 max-h-screen overflow-hidden mx-auto bg-gray-50 text-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-center">Phần mềm quản lý</h1>
      <p className="text-center">
        Quản lý bệnh nhân, đơn thuốc và thuốc hiệu quả, tiết kiệm thời gian.
      </p>
      <div className="my-4">
        <Button
          type="primary"
          size="large"
          className="mr-4"
          onClick={() => {
            setOpenPrescriptionModal(true);
          }}
        >
          ➕ Tạo đơn thuốc mới
        </Button>
        <Button
          size="large"
          className="mr-4"
          onClick={() => {
            setOpenPatientModal(true);
          }}
        >
          👤 Thêm bệnh nhân
        </Button>
        <Button
          size="large"
          onClick={() => {
            setOpenMedicineModal(true);
          }}
        >
          💊 Thêm thuốc
        </Button>
      </div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Statistic title="Đơn thuốc hôm nay" value={countPrescriptionToday} />
        </Col>
        <Col span={8}>
          <Statistic title="Bệnh nhân mới" value={countPatientToday} />
        </Col>
        <Col span={8}>
          <Statistic title="Số loại thuốc" value={countMedicine} />
        </Col>
      </Row>
      <div className="overflow-auto">
        <Card
          title="Đơn thuốc gần đây"
          extra={<a href="/prescription">Tất cả</a>}
        >
          <List
            dataSource={recentPrescriptions}
            renderItem={(item) => (
              <List.Item
                actions={[<a href={`/prescription/${item.id}`}>Xem</a>]}
              >
                <List.Item.Meta
                  title={`${item.code} - ${item.patientId}`}
                  description={`Ngày: ${dayjs(item.createdAt).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}`}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>

      {/* Modal Thêm Bệnh Nhân */}
      <Modal
        title="Thêm bệnh nhân mới"
        open={openPatientModal}
        onCancel={() => setOpenPatientModal(false)}
        footer={null}
        destroyOnHidden
      >
        <AddPatientForm onSuccess={() => setOpenPatientModal(false)} />
      </Modal>

      {/* Modal Thêm Thuốc */}
      <Modal
        title="Thêm thuốc mới"
        open={openMedicineModal}
        onCancel={() => setOpenMedicineModal(false)}
        footer={null}
        destroyOnHidden
      >
        <AddMedicineForm onSuccess={() => setOpenMedicineModal(false)} />
      </Modal>

      {/* Modal Thêm Đơn Thuốc */}
      <Modal
        title="Thêm đơn thuốc mới"
        open={openPrescriptionModal}
        onCancel={() => setOpenPrescriptionModal(false)}
        footer={null}
        destroyOnHidden
      >
        <PrescriptionForm
          onSuccess={(item) => {
            setOpenPrescriptionModal(false);
            setRecentPrescriptions([...recentPrescriptions, item]);
          }}
          onCancel={() => setOpenPrescriptionModal(false)}
        />
      </Modal>
    </div>
  );
}
