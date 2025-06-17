"use client";
import { useState } from "react";
import { Button, Card, List, Statistic, Row, Col, Modal } from "antd";
import AddPatientForm from "@/components/AddPatientForm";
import AddMedicineForm from "@/components/AddMedicineForm";
import PrescriptionForm from "@/components/PrescriptionForm";

export default function HomePage() {
  const [openPatientModal, setOpenPatientModal] = useState(false);
  const [openMedicineModal, setOpenMedicineModal] = useState(false);
  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);
  const [recentPrescriptions, setRecentPrescriptions] = useState([
    { code: "#1234", name: "Nguyễn Văn B", date: "15/06/2025" },
    { code: "#1233", name: "Trần Thị C", date: "14/06/2025" },
  ]);

  return (
    <div className="p-16 max-h-screen overflow-hidden mx-auto bg-gray-50 text-gray-900">
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
          <Statistic title="Đơn thuốc hôm nay" value={5} />
        </Col>
        <Col span={8}>
          <Statistic title="Bệnh nhân mới" value={2} />
        </Col>
        <Col span={8}>
          <Statistic title="Số loại thuốc" value={20} />
        </Col>
      </Row>
      <Card
        title="Đơn thuốc gần đây"
        extra={<a href="/prescription">Tất cả</a>}
      >
        <List
          dataSource={recentPrescriptions}
          renderItem={(item) => (
            <List.Item
              actions={[<a href={`/prescription/${item.code}`}>Xem</a>]}
            >
              <List.Item.Meta
                title={`${item.code} - ${item.name}`}
                description={`Ngày: ${item.date}`}
              />
            </List.Item>
          )}
        />
      </Card>

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
          onSuccess={() => {
            setOpenPrescriptionModal(false);
            setRecentPrescriptions([
              ...recentPrescriptions,
              {
                code: "#1235",
                name: "Nguyễn Văn D",
                date: "16/06/2025",
              },
            ]);
          }}
          onCancel={() => setOpenPrescriptionModal(false)}
        />
      </Modal>
    </div>
  );
}
