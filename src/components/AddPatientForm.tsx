// components/AddPatientForm.jsx
"use client";

import { Form, Input, Button, DatePicker, Select, message } from "antd";

export default function AddPatientForm({ onSuccess }) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    // Gửi values lên API backend tại đây
    // fetch('/api/patients', { ... })
    console.log("Dữ liệu bệnh nhân:", values);
    message.success("Thêm bệnh nhân mới thành công!");
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
      <Form.Item
        label="Họ và tên"
        name="fullName"
        rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Ngày sinh"
        name="dob"
        rules={[{ required: true, message: "Nhập ngày sinh!" }]}
      >
        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
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
