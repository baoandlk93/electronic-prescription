"use client";

import { Button, Modal } from "antd";
import DataTable from "@/components/ultility/DataTable";
import { useEffect, useState } from "react";
import AddMedicineForm from "@/components/form/AddMedicineForm";
import { GiMedicines } from "react-icons/gi";
import { Medicine } from "@/types/Medicine";
import DeleteModal from "@/components/ultility/DeleteModal";
import { toast } from "react-toastify";
import MedicineImport from "@/components/xlsx/MedicineImport";
export default function MedicinePage() {
  const [openMedicineModal, setOpenMedicineModal] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [medicineIdToDelete, setMedicineIdToDelete] = useState<string | "">("");
  const [importing, setImporting] = useState(false);

  function openDeleteModal(id: string) {
    setMedicineIdToDelete(id);
    setModalOpen(true);
  }

  const fetchMedicines = async () => {
    const response = await fetch("/api/medicines");
    const data = await response.json();
    setMedicines(data);
  };

  const handleDelete = async () => {
    if (!medicineIdToDelete) return;
    await fetch(`/api/medicines`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: medicineIdToDelete }),
    })
      .then(() => {
        fetchMedicines();
        setModalOpen(false);
        toast.success("Xóa thuốc thành công!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Xóa thuốc thất bại!");
      });
  };

  const BATCH_SIZE = 500;

  const handleImportMedicines = async (items: any[]) => {
    if (items.length === 0) return;
    setImporting(true);
    let totalImported = 0;
    try {
      for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        const res = await fetch("/api/medicines/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(batch),
        });
        if (!res.ok) throw new Error(await res.text());
        const { count } = await res.json();
        totalImported += count;
      }
      toast.success(`Import thành công ${totalImported} thuốc!`);
      fetchMedicines();
    } catch {
      toast.error("Import thất bại!");
    } finally {
      setImporting(false);
    }
  };
  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <div className="flex flex-col w-full max-h-screen overflow-hidden bg-gray-50 text-gray-900 px-16 py-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Quản lý thuốc</h1>
      <div className="flex justify-start mb-4 gap-4">
        <Button
          type="primary"
          onClick={() => {
            setOpenMedicineModal(true);
            setEditingMedicine(null);
          }}
        >
          <GiMedicines /> Thêm thuốc
        </Button>
        <MedicineImport onImport={handleImportMedicines} loading={importing} />
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
            title: "Hoạt chất/Hàm lượng",
            dataIndex: "content",
            key: "content",
          },
          {
            title: "Đơn vị",
            dataIndex: "unit",
            key: "unit",
          },
          {
            title: "Hành động",
            key: "action",
            align: "center",
            fixed: "right",
            render: (record: Medicine) => (
              <>
                <div className="flex gap-2">
                  <Button
                    className="mr-2"
                    type="primary"
                    onClick={() => {
                      setEditingMedicine(record);
                      setOpenMedicineModal(true);
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
                </div>
              </>
            ),
          },
        ]}
        dataSource={medicines}
      />
      <Modal
        title="Thêm thuốc mới"
        open={openMedicineModal}
        onCancel={() => setOpenMedicineModal(false)}
        footer={null}
        destroyOnHidden
      >
        <AddMedicineForm
          onSuccess={() => {
            setOpenMedicineModal(false);
            fetchMedicines();
          }}
          editingMedicine={editingMedicine}
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
