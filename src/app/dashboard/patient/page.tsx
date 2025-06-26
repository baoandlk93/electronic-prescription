"use client";
import { Button } from "antd";
import { useState, useEffect } from "react";
import AddPatientForm from "@/components/form/AddPatientForm";
import { Patient } from "@/types/Patient";
import Modal from "antd/es/modal/Modal";
import { FaUser } from "react-icons/fa";
import DataTable from "@/components/ultility/DataTable";
import DeleteModal from "@/components/ultility/DeleteModal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
export default function PatientPage() {
  const [openMedicineModal, setOpenMedicineModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientIdToDelete, setPatientIdToDelete] = useState<string | "">("");
  const [modalOpen, setModalOpen] = useState(false);
  const fetchPatients = async () => {
    const response = await fetch("/api/patients");
    const data = await response.json();
    setPatients(data);
  };
  useEffect(() => {
    fetchPatients();
  }, []);
  function openDeleteModal(id: string) {
    setPatientIdToDelete(id);
    setModalOpen(true);
  }
  const handleDelete = async () => {
    if (!patientIdToDelete) return;
    await fetch(`/api/patients`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: patientIdToDelete }),
    })
      .then(() => {
        fetchPatients();
        setModalOpen(false);
        toast.success("Xóa bệnh nhân thành công!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Xóa bệnh nhân thất bại!");
      });
  };
  return (
    <div className="flex flex-col w-[calc(100vw-200px)] max-h-screen overflow-hidden bg-gray-50 text-gray-900 p-16">
      <h1 className="text-2xl font-bold mb-4 text-center">Quản lý bệnh nhân</h1>
      <div className="flex justify-start mb-4">
        <Button
          type="primary"
          onClick={() => {
            setOpenMedicineModal(true);
            setEditingPatient(null);
          }}
        >
          <FaUser /> Thêm bệnh nhân
        </Button>
      </div>
      <DataTable
        columns={[
          {
            title: "Mã",
            dataIndex: "id",
            key: "id",
            fixed: "left",
          },
          {
            title: "Tên",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Năm sinh",
            dataIndex: "dateOfBirth",
            key: "dateOfBirth",
            render: (value: string) =>
              value ? dayjs(value).format("YYYY") : "",
          },
          {
            title: "Giới tính",
            dataIndex: "gender",
            key: "gender",
            render: (value: string) =>
              value === "male" ? "Nam" : value === "female" ? "Nữ" : "Khác",
          },
          {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
          },
          {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
          },
          {
            title: "Hành động",
            key: "action",
            align: "center",
            fixed: "right",
            render: (record: Patient) => (
              <>
                <div className="flex gap-2">
                  <Button
                    className="mr-2"
                    type="primary"
                    onClick={() => {
                      setEditingPatient(record);
                      setOpenMedicineModal(true);
                    }}
                  >
                    <FaUser /> Sửa
                  </Button>
                  <Button
                    className="ml-2"
                    type="primary"
                    danger
                    onClick={() => {
                      openDeleteModal(record.id);
                    }}
                  >
                    <FaUser /> Xóa
                  </Button>
                </div>
              </>
            ),
          },
        ]}
        dataSource={patients}
      />
      <Modal
        title="Thêm bệnh nhân mới"
        open={openMedicineModal}
        onCancel={() => setOpenMedicineModal(false)}
        footer={null}
        destroyOnHidden
      >
        <AddPatientForm
          onSuccess={async () => {
            setOpenMedicineModal(false);
            await fetchPatients(); // Đảm bảo dùng await
          }}
          editingPatient={editingPatient}
        />
      </Modal>
      <DeleteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
}
