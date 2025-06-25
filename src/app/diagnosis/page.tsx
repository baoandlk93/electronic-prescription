"use client";

import { Button, Modal } from "antd";
import DataTable from "@/components/ultility/DataTable";
import { useEffect, useState } from "react";
import { GiMedicines } from "react-icons/gi";
import { DiagnosisDetail } from "@/types/DiagnosisDetail";
import DeleteModal from "@/components/ultility/DeleteModal";
import { toast } from "react-toastify";
import AddDiagnosisForm from "@/components/form/AddDiagnosisForm";
import DiseaseImport from "@/components/xlsx/DiseaseImport";

export default function DiagnosisPage() {
  const [openDiagnosisModal, setOpenDiagnosisModal] = useState(false);
  const [diagnoses, setDiagnoses] = useState<DiagnosisDetail[]>([]);
  const [editingDiagnosis, setEditingDiagnosis] =
    useState<DiagnosisDetail | null>(null);
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
  const handleImportDiseases = (diseases: any[]) => {
    const filtered = diseases.filter((disease) =>
      (disease["tên_bệnh"] || "").toString().toLowerCase().includes("phổi")
    );
    filtered.forEach((disease) => {
      fetch("/api/diagnoses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: disease.tên_bệnh,
          code: disease.mã,
          description: disease.mô_tả,
        }),
      }).catch((err) => {});
    });
  };
  return (
    <div className="flex flex-col w-full max-h-screen overflow-hidden bg-gray-50 text-gray-900 p-16">
      <h1 className="text-2xl font-bold mb-4 text-center">Quản lý bệnh</h1>
      <div className="flex gap-4 justify-start mb-4">
        <Button
          type="primary"
          onClick={() => {
            setOpenDiagnosisModal(true);
            setEditingDiagnosis(null);
          }}
        >
          <GiMedicines /> Thêm bệnh
        </Button>
        <DiseaseImport onImport={handleImportDiseases} />
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
            align: "center",
            fixed: "right",
            render: (record: DiagnosisDetail) => (
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
