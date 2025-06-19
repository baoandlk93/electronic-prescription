"use client";
import { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import PrescriptionForm from "@/components/form/PrescriptionForm";
import DataTable from "@/components/ultility/DataTable";
import { PrescriptionDetail } from "@/types/PrescriptionDetail";
import { Patient } from "@/types/Patient";
import { GiMedicines } from "react-icons/gi";
import DeleteModal from "@/components/ultility/DeleteModal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import PrescriptionDetailModal from "@/components/PrescriptionDetailModal";
import { PDFViewer } from "@react-pdf/renderer";
import { MyDocument } from "@/components/PDF/MyDocument";
import PrescriptionAutoComplete from "@/components/PrescriptionAutoComplete";
export default function PrescriptionPage() {
  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);
  const [editingPrescription, setEditingPrescription] =
    useState<PrescriptionDetail | null>(null);
  const [prescriptions, setPrescriptions] = useState<PrescriptionDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [viewingPrescription, setViewingPrescription] =
    useState<PrescriptionDetail | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openPdfModal, setOpenPdfModal] = useState(false);
  useEffect(() => {
    fetchPrescriptions();
  }, []);
  useEffect(() => {
    if (!loading) {
      fetchPatient();
    }
  }, [loading]);
  const fetchPrescriptions = async () => {
    setLoading(true);
    const response = await fetch("/api/prescriptions");
    const data = await response.json();
    setPrescriptions(data);
    setLoading(false);
  };
  const fetchPatient = async () => {
    const response = await fetch("/api/patients");
    const data = await response.json();
    setPatients(data);
  };

  const handleEdit = async (record: PrescriptionDetail) => {
    const res = await fetch(`/api/prescriptions/${record.id}`);
    const data = await res.json();
    setEditingPrescription(data);
    setOpenPrescriptionModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setOpenDeleteModal(true);
  };
  const handleView = async (id: string) => {
    const res = await fetch(`/api/prescriptions/${id}`);
    const data = await res.json();
    setViewingPrescription(data);
    setOpenViewModal(true);
  };
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    await fetch(`/api/prescriptions/${deletingId}`, {
      method: "DELETE",
    });
    toast.success("Xóa đơn thuốc thành công");
    fetchPrescriptions();
    setOpenDeleteModal(false);
    setDeletingId(null);
  };

  const handleOpenPdfModal = (open: boolean) => {
    setOpenViewModal(false);
    setOpenPdfModal(open);
  };
  return (
    <div className="p-16 max-h-screen overflow-hidden mx-auto bg-gray-50 text-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-center">Quản lý đơn thuốc</h1>
      <div className="my-4 flex justify-between">
        <Button
          type="primary"
          size="large"
          className="mr-4"
          onClick={() => {
            setOpenPrescriptionModal(true);
            setEditingPrescription(null);
          }}
        >
          ➕ Tạo đơn thuốc mới
        </Button>
        <PrescriptionAutoComplete onSelectPrescription={handleView} />
      </div>
      <DataTable
        columns={[
          {
            title: "STT",
            dataIndex: "id",
            key: "id",
            fixed: "left",
          },
          {
            title: "Mã",
            dataIndex: "code",
            key: "code",
          },
          {
            title: "Tên bệnh nhân",
            dataIndex: "patientId",
            key: "patientId",
            render: (text: string) => {
              const patient = patients.find((item) => item.id === text);
              return patient?.name;
            },
          },
          {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
          },
          {
            title: "Hành động",
            key: "action",
            fixed: "right",
            render: (record: PrescriptionDetail) => (
              <>
                <div className="flex gap-2">
                  <Button
                    className="mr-1"
                    type="primary"
                    onClick={() => {
                      handleView(record.id);
                    }}
                  >
                    <GiMedicines />
                    Chi tiết
                  </Button>
                  <Button
                    className="mr-1"
                    type="primary"
                    onClick={() => {
                      handleEdit(record);
                    }}
                  >
                    <GiMedicines />
                    Sửa
                  </Button>
                  <Button
                    className="mr-1"
                    type="primary"
                    danger
                    onClick={() => {
                      handleDelete(record.id);
                    }}
                  >
                    <GiMedicines />
                    Xóa
                  </Button>
                </div>
              </>
            ),
          },
        ]}
        dataSource={prescriptions}
      />
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
            fetchPrescriptions();
          }}
          onCancel={() => setOpenPrescriptionModal(false)}
          editingPrescription={editingPrescription}
        />
      </Modal>
      <DeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onDelete={() => handleDeleteConfirm()}
      />
      <PrescriptionDetailModal
        setOpenPdfModal={handleOpenPdfModal}
        visible={openViewModal}
        onClose={() => setOpenViewModal(false)}
        prescriptionDetails={viewingPrescription}
      />
      <Modal
        title="Xem chi tiết đơn thuốc"
        open={openPdfModal}
        onCancel={() => setOpenPdfModal(false)}
        footer={null}
        destroyOnHidden
      >
        <div className="flex justify-between">
          <PDFViewer width={1000} height={800}>
            <MyDocument prescriptionDetails={viewingPrescription} size={"A4"} />
          </PDFViewer>
        </div>
      </Modal>
    </div>
  );
}
