"use client";

import { Modal, Button } from "antd";

export default function DeleteModal({
  open,
  onClose,
  onDelete,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  loading?: boolean;
}) {
  return (
    <Modal
      title="Xóa"
      open={open}
      onOk={onDelete}
      onCancel={onClose}
      footer={null}
    >
      <p>Bạn có chắc chắn muốn xóa?</p>
      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Hủy</Button>
        <Button
          style={{
            background: "#e53e3e",
            color: "#fff",
            border: "none",
            padding: "6px 16px",
            borderRadius: "4px",
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={onDelete}
        >
          Xóa
        </Button>
      </div>
    </Modal>
  );
}
