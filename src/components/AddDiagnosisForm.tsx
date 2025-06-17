"use client";

import { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import { Diagnosis } from "../types/Diagnosis";

export default function AddDiagnosisForm({
  onSuccess,
  editingDiagnosis,
}: {
  onSuccess?: () => void;
  editingDiagnosis?: Diagnosis;
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingDiagnosis) {
      form.setFieldsValue(editingDiagnosis);
    } else {
      form.resetFields();
    }
  }, [editingDiagnosis]);

  const handleFinish = async (values: Diagnosis) => {
    try {
      const method = editingDiagnosis ? "PUT" : "POST";
      const response = await fetch("/api/diagnoses", {
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
      toast.success(
        editingDiagnosis
          ? "Cập nhật bệnh thành công!"
          : "Thêm bệnh mới thành công!"
      );
      form.resetFields();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Lỗi khi thêm/cập nhật bệnh!");
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
        label="Tên bệnh"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên bệnh!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Mã"
        name="code"
        rules={[{ required: true, message: "Nhập mã bệnh" }]}
      >
        <Input placeholder="Ví dụ: A01" />
      </Form.Item>
      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Nhập mô tả" }]}
      >
        <Input placeholder="Mô tả bệnh" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu bệnh
        </Button>
      </Form.Item>
    </Form>
  );
}
