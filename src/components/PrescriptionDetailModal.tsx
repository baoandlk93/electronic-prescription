import React from "react";
import { Modal, Descriptions, Table } from "antd";
import dayjs from "dayjs";
import { Prescription } from "../types/Prescription";

const PrescriptionDetailModal = ({
  visible,
  onClose,
  prescriptionDetails,
}: {
  visible: boolean;
  onClose: () => void;
  prescriptionDetails: Prescription | null;
}) => {
  // Table columns for medicines in prescription
  const medicineColumns = [
    { title: "Tên thuốc", dataIndex: ["medicine", "name"], key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Đơn vị", dataIndex: ["medicine", "unit"], key: "unit" },
    { title: "Cách dùng", dataIndex: "usage", key: "usage" },
  ];
  console.log(prescriptionDetails);
  return (
    <Modal
      title="Chi tiết đơn thuốc"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Mã đơn">
          {prescriptionDetails?.code}
        </Descriptions.Item>
        <Descriptions.Item label="Bệnh nhân">
          {prescriptionDetails?.patient?.name}
          {dayjs(prescriptionDetails?.patient?.dateOfBirth).format(
            "DD/MM/YYYY"
          ) && (
            <>
              {" "}
              -{" "}
              {dayjs(prescriptionDetails?.patient?.dateOfBirth).format(
                "DD/MM/YYYY"
              )}
            </>
          )}
          {prescriptionDetails?.patient?.gender && (
            <> ({prescriptionDetails?.patient.gender})</>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Chẩn đoán">
          {prescriptionDetails?.diagnoses
            ?.map((d) => d.diagnosis.code)
            .join("\n")}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {dayjs(prescriptionDetails?.date).format("DD/MM/YYYY")}
        </Descriptions.Item>
        <Descriptions.Item label="Lời dặn">
          {prescriptionDetails?.advice}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tái khám">
          {prescriptionDetails?.followUpDate &&
            dayjs(prescriptionDetails?.followUpDate).format("DD/MM/YYYY")}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 24, marginBottom: 8, fontWeight: "bold" }}>
        Danh sách thuốc
      </div>
      <Table
        columns={medicineColumns}
        dataSource={prescriptionDetails?.items || []}
        rowKey={(record, idx) => idx}
        pagination={false}
        size="small"
      />
    </Modal>
  );
};

export default PrescriptionDetailModal;
