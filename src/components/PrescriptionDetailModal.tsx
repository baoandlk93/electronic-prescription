import React from "react";
import { Modal, Descriptions, Table, Popover, Tag, Button } from "antd";
import dayjs from "dayjs";
import { PrescriptionDetail } from "../types/PrescriptionDetail";

const PrescriptionDetailModal = ({
  visible,
  onClose,
  prescriptionDetails,
  setOpenPdfModal,
}: {
  visible: boolean;
  onClose: () => void;
  prescriptionDetails: PrescriptionDetail | null;
  setOpenPdfModal: (open: boolean) => void;
}) => {
  // Table columns for medicines in prescription
  const medicineColumns = [
    { title: "Tên thuốc", dataIndex: ["medicine", "name"], key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Đơn vị", dataIndex: ["medicine", "unit"], key: "unit" },
    { title: "Cách dùng", dataIndex: "instruction", key: "instruction" },
  ];
  if (!prescriptionDetails) return null;
  const diagnoses = prescriptionDetails.diagnoses?.map((d) => (
    <Popover
      title={d.diagnosis.name}
      content={<div>{d.diagnosis.description}</div>}
      key={d.diagnosis.id}
    >
      <Tag color="#2db7f5" className="cursor-pointer">
        {d.diagnosis.code}
      </Tag>
    </Popover>
  ));
  return (
    <Modal
      title="Chi tiết đơn thuốc"
      open={visible}
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
        <Descriptions.Item label="Chẩn đoán">{diagnoses}</Descriptions.Item>
        <Descriptions.Item label="Triệu chứng">
          {prescriptionDetails?.symptom}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {dayjs(prescriptionDetails?.createdAt).format("DD/MM/YYYY")}
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
        rowKey={(record, idx) => record.id ?? idx?.toString() ?? "0"}
        pagination={false}
        size="small"
      />
      <div className="mt-4 flex justify-center">
        <Button
          type="primary"
          danger
          size="large"
          onClick={() => {
            setOpenPdfModal(true);
          }}
        >
          Xem PDF
        </Button>
      </div>
    </Modal>
  );
};

export default PrescriptionDetailModal;
