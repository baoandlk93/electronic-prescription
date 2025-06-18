"use client";
import { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import PrescriptionForm from "@/components/PrescriptionForm";
import DataTable from "@/components/DataTable";
import { Prescription } from "@/types/Prescription";
import { Patient } from "@/types/Patient";
import { GiMedicines } from "react-icons/gi";
import DeleteModal from "@/components/DeleteModal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
export default function PrescriptionPage() {
  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);
  const [editingPrescription, setEditingPrescription] =
    useState<Prescription | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
    console.log(data);
    setPrescriptions(data);
    setLoading(false);
  };
  const fetchPatient = async () => {
    const response = await fetch("/api/patients");
    const data = await response.json();
    setPrescriptions((prev) => {
      return prev.map((item) => {
        return {
          ...item,
          patient: data.find(
            (patient: Patient) => patient.id === item.patientId
          ),
        };
      });
    });
  };

  const handleEdit = async (record: Prescription) => {
    const res = await fetch(`/api/prescriptions/${record.id}`);
    const data = await res.json();
    setEditingPrescription(data);
    setOpenPrescriptionModal(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setOpenDeleteModal(true);
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

  return (
    <div className="p-16 max-h-screen overflow-hidden mx-auto bg-gray-50 text-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-center">Quản lý đơn thuốc</h1>
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
      </div>
      <DataTable
        columns={[
          {
            title: "STT",
            dataIndex: "id",
            key: "id",
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
              const patient = prescriptions.find(
                (item) => item.patientId === text
              );
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
            render: (record: Prescription) => (
              <>
                <Button
                  className="mr-2"
                  type="primary"
                  onClick={() => {
                    handleEdit(record);
                  }}
                >
                  <GiMedicines /> Sửa
                </Button>
                <Button
                  className="ml-2"
                  type="primary"
                  danger
                  onClick={() => {
                    handleDelete(record.id);
                  }}
                >
                  <GiMedicines /> Xóa
                </Button>
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
    </div>
  );
}
