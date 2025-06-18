"use client";

import { Button, Modal } from "antd";
import DataTable from "@/components/DataTable";
import { useEffect, useState } from "react";
import { GiMedicines } from "react-icons/gi";
import { Diagnosis } from "@/types/Diagnosis";
import DeleteModal from "@/components/DeleteModal";
import { toast } from "react-toastify";
import AddDiagnosisForm from "@/components/AddDiagnosisForm";

export default function DiagnosisPage() {
  const [openDiagnosisModal, setOpenDiagnosisModal] = useState(false);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [editingDiagnosis, setEditingDiagnosis] = useState<Diagnosis | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [diagnosisIdToDelete, setDiagnosisIdToDelete] = useState<string | "">(
    ""
  );

  function openDeleteModal(id: string) {
    setDiagnosisIdToDelete(id);
    setModalOpen(true);
  }

  const fetchDiagnoses = async () => {
    const response = await fetch("/api/diagnoses");
    const data = await response.json();
    setDiagnoses(data);
  };
  useEffect(() => {
    fetchDiagnoses();
  }, []);
  const handleDelete = async () => {
    if (!diagnosisIdToDelete) return;
    await fetch(`/api/diagnoses`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: diagnosisIdToDelete }),
    })
      .then(() => {
        fetchDiagnoses();
        setModalOpen(false);
        toast.success("Xóa bệnh thành công!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Xóa bệnh thất bại!");
      });
  };
  return (
    <div className="flex flex-col max-h-screen overflow-hidden bg-gray-50 text-gray-900 p-16">
      <h1 className="text-2xl font-bold mb-4 text-center">Quản lý bệnh</h1>
      <div className="flex justify-start mb-4">
        <Button
          type="primary"
          onClick={() => {
            setOpenDiagnosisModal(true);
            setEditingDiagnosis(null);
          }}
        >
          <GiMedicines /> Thêm bệnh
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
            title: "Tên",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Mã",
            dataIndex: "code",
            key: "code",
          },
          {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Hành động",
            key: "action",
            render: (record: Diagnosis) => (
              <>
                <Button
                  className="mr-2"
                  type="primary"
                  onClick={() => {
                    setEditingDiagnosis(record);
                    setOpenDiagnosisModal(true);
                  }}
                >
                  <GiMedicines /> Sửa
                </Button>
                <Button
                  className="ml-2"
                  type="primary"
                  danger
                  onClick={() => {
                    openDeleteModal(record.id);
                  }}
                >
                  <GiMedicines /> Xóa
                </Button>
              </>
            ),
          },
        ]}
        dataSource={diagnoses}
      />
      <Modal
        title="Thêm bệnh mới"
        open={openDiagnosisModal}
        onCancel={() => setOpenDiagnosisModal(false)}
        footer={null}
        destroyOnHidden
      >
        <AddDiagnosisForm
          onSuccess={() => {
            setOpenDiagnosisModal(false);
            fetchDiagnoses();
          }}
          editingDiagnosis={editingDiagnosis}
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
