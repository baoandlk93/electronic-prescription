"use client";
import { useState, useEffect } from "react";
import { Button, Card, List, Statistic, Row, Col, Modal } from "antd";
import AddPatientForm from "@/components/form/AddPatientForm";
import AddMedicineForm from "@/components/form/AddMedicineForm";
import PrescriptionForm from "@/components/form/PrescriptionForm";
import { Prescription } from "@/types/Prescription";
import dayjs from "dayjs";
import Link from "next/link";
import { GiMedicines } from "react-icons/gi";
import { PrescriptionDetail } from "@/types/PrescriptionDetail";
import PrescriptionDetailModal from "./PrescriptionDetailModal";
import PrescriptionAutoComplete from "./PrescriptionAutoComplete";
import { PDFViewer } from "@react-pdf/renderer";
import { MyDocument } from "./PDF/MyDocument";

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
  const [viewingPrescription, setViewingPrescription] =
    useState<PrescriptionDetail | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openPdfModal, setOpenPdfModal] = useState(false);
  useEffect(() => {
    fetchRecentPrescriptions();
    fetchCountPrescriptionToday();
    fetchCountPatientToday();
    fetchCountMedicine();
  }, []);

  const fetchRecentPrescriptions = async () => {
    const response = await fetch("/api/prescriptions?limit=10&offset=0");
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
    setCountPatientToday(data.count);
  };

  const fetchCountMedicine = async () => {
    const response = await fetch("/api/medicines/count");
    const data = await response.json();
    setCountMedicine(data.count);
  };

  const handleView = async (id: string) => {
    const res = await fetch(`/api/prescriptions/${id}`);
    const data = await res.json();
    setViewingPrescription(data);
    setOpenViewModal(true);
  };

  const handleOpenPdfModal = (open: boolean) => {
    setOpenViewModal(false);
    setOpenPdfModal(open);
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
      <div className="my-4 flex justify-center">
        <PrescriptionAutoComplete onSelectPrescription={handleView} />
      </div>
      <div className="overflow-auto">
        <Card
          title="Đơn thuốc gần đây"
          extra={<Link href="/prescription">Tất cả</Link>}
        >
          <List
            dataSource={recentPrescriptions || []}
            renderItem={(item: Prescription) => (
              <List.Item
                actions={[
                  <>
                    <Button
                      className="mr-1"
                      type="primary"
                      onClick={() => {
                        handleView(item.id);
                      }}
                    >
                      <GiMedicines />
                      Chi tiết
                    </Button>
                  </>,
                ]}
              >
                <List.Item.Meta
                  title={`${item.code} - ${item?.patient?.name}`}
                  description={`Ngày: ${dayjs(item?.createdAt).format(
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
        <AddPatientForm
          onSuccess={() => setOpenPatientModal(false)}
          editingPatient={null}
        />
      </Modal>

      {/* Modal Thêm Thuốc */}
      <Modal
        title="Thêm thuốc mới"
        open={openMedicineModal}
        onCancel={() => setOpenMedicineModal(false)}
        footer={null}
        destroyOnHidden
      >
        <AddMedicineForm
          onSuccess={() => setOpenMedicineModal(false)}
          editingMedicine={null}
        />
      </Modal>

      {/* Modal Thêm Đơn Thuốc */}
      <Modal
        title="Thêm đơn thuốc mới"
        open={openPrescriptionModal}
        onCancel={() => setOpenPrescriptionModal(false)}
        footer={null}
        destroyOnHidden
        width={1000}
      >
        <PrescriptionForm
          editingPrescription={null}
          onSuccess={() => {
            setOpenPrescriptionModal(false);
            fetchRecentPrescriptions();
          }}
          onCancel={() => setOpenPrescriptionModal(false)}
        />
      </Modal>
      <PrescriptionDetailModal
        setOpenPdfModal={handleOpenPdfModal}
        visible={openViewModal}
        onClose={() => setOpenViewModal(false)}
        prescriptionDetails={viewingPrescription}
      />
      <Modal
        title="Xem PDF"
        open={openPdfModal}
        onCancel={() => setOpenPdfModal(false)}
        footer={null}
        width={"full"}
        style={{ top: 20 }}
        destroyOnHidden
      >
        <PDFViewer style={{ width: "100%", height: "768px" }}>
          <MyDocument prescriptionDetails={viewingPrescription} size="A4" />
        </PDFViewer>
      </Modal>
    </div>
  );
}
