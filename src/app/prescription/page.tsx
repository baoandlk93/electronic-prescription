"use client";
import { useState } from "react";
import { Button, Modal } from "antd";
import PrescriptionForm from "@/components/PrescriptionForm";
import DataTable from "@/components/DataTable";
import { Prescription } from "@/types/Prescription";
import { GiMedicines } from "react-icons/gi";
export default function PrescriptionPage() {
  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);
  const [editingPrescription, setEditingPrescription] =
    useState<Prescription | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

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
            title: "Tên",
            dataIndex: "patient.name",
            key: "name",
          },
          {
            title: "Hành động",
            dataIndex: "unit",
            key: "unit",
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
                    setEditingPrescription(record);
                    setOpenPrescriptionModal(true);
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
        />
      </Modal>
    </div>
  );
}
