"use client";

import { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import { Medicine } from "@/types/Medicine";

export default function AddMedicineForm({
  onSuccess,
  editingMedicine,
}: {
  onSuccess?: () => void;
  editingMedicine: Medicine | null;
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingMedicine) {
      form.setFieldsValue(editingMedicine);
    } else {
      form.resetFields();
    }
  }, [editingMedicine]);

  const handleFinish = async (values: Medicine) => {
    try {
      const method = editingMedicine ? "PUT" : "POST";
      const response = await fetch("/api/medicines", {
        method,
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });

      // Xử lý lỗi phía server trả về
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Có lỗi xảy ra trên server!");
      }

      const data = await response.json();
      console.log(data);
      toast.success(
        editingMedicine
          ? "Cập nhật thuốc thành công!"
          : "Thêm thuốc mới thành công!"
      );
      form.resetFields();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Lỗi khi thêm/cập nhật thuốc!");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <Form.Item label="Mã" hidden name="id">
        <Input hidden />
      </Form.Item>
      <Form.Item
        label="Tên thuốc"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên thuốc!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Hoạt chất/Hàm lượng"
        name="content"
        rules={[{ required: true, message: "Nhập thành phần, hàm lượng" }]}
      >
        <Input placeholder="Ví dụ: Paracetamol 500mg" />
      </Form.Item>
      <Form.Item
        label="Đơn vị"
        name="unit"
        rules={[{ required: true, message: "Nhập đơn vị" }]}
      >
        <Input placeholder="viên, ống, gói..." />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu thuốc
        </Button>
      </Form.Item>
    </Form>
  );
}
