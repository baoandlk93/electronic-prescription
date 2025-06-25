"use client";

import { Patient } from "@/types/Patient";
import { useEffect } from "react";
import { Form, Input, Button, DatePicker, Select } from "antd";
import dayjs from "dayjs";
export default function AddPatientForm({
  onSuccess,
  editingPatient,
}: {
  onSuccess?: () => void;
  editingPatient: Patient | null;
}) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (editingPatient) {
      form.setFieldsValue({
        id: editingPatient.id,
        fullName: editingPatient.name, // mapping từ name sang fullName
        dob: editingPatient.dateOfBirth
          ? dayjs(editingPatient.dateOfBirth, "YYYY")
          : null, // mapping date
        gender: editingPatient.gender,
        phone: editingPatient.phone,
        address: editingPatient.address,
      });
    } else {
      form.resetFields();
    }
  }, [editingPatient]);
  const handleFinish = async (values: any) => {
    if (!values.dob) {
      form.setFields([{ name: "dob", errors: ["Bạn chưa nhập ngày sinh!"] }]);
      return;
    }
    const data = {
      ...(editingPatient?.id ? { id: editingPatient.id } : {}),
      name: values.fullName,
      dateOfBirth: values.dob ? values.dob.format("YYYY") : undefined,
      gender: values.gender,
      address: values.address,
      phone: values.phone,
    };
    await fetch("/api/patients", {
      method: editingPatient ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    form.resetFields();
    if (onSuccess) onSuccess();
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
        label="Họ và tên"
        name="fullName"
        rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Năm sinh"
        name="dob"
        rules={[{ required: true, message: "Nhập năm sinh!" }]}
      >
        <DatePicker picker="year" format="YYYY" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Giới tính"
        name="gender"
        rules={[{ required: true, message: "Chọn giới tính!" }]}
      >
        <Select
          options={[
            { label: "Nam", value: "male" },
            { label: "Nữ", value: "female" },
            { label: "Khác", value: "other" },
          ]}
        />
      </Form.Item>
      <Form.Item label="Số điện thoại" name="phone">
        <Input />
      </Form.Item>
      <Form.Item label="Địa chỉ" name="address">
        <Input.TextArea />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu bệnh nhân
        </Button>
      </Form.Item>
    </Form>
  );
}
