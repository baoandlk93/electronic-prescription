"use client";

import { Patient } from "@/types/Patient";
import { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Select, Modal } from "antd";
import dayjs from "dayjs";
import AddressForm from "./AddressForm";
import { toast } from "react-toastify";
export default function AddPatientForm({
  onSuccess,
  editingPatient,
}: {
  onSuccess?: () => void;
  editingPatient: Patient | null;
}) {
  const [form] = Form.useForm();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState("");
  const handleClose = () => {
    setAddress("");
    setShowAddressForm(false);
  };
  useEffect(() => {
    if (editingPatient) {
      setAddress(editingPatient.address);
      form.setFieldsValue({
        id: editingPatient.id,
        fullName: editingPatient.name, // mapping từ name sang fullName
        dob: editingPatient.dateOfBirth
          ? dayjs(editingPatient.dateOfBirth, "DD/MM/YYYY")
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
      dateOfBirth: values.dob,
      gender: values.gender,
      address: address,
      phone: values.phone,
    };
    await fetch("/api/patients", {
      method: editingPatient ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res, "res");
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        toast.success("Thêm bệnh nhân thành công");
      })
      .catch((err) => {
        toast.error(err.message);
        console.error(err);
      })
      .finally(() => {
        form.resetFields();
        if (onSuccess) onSuccess();
      });
  };
  const handleSuccess = (data: any) => {
    const newData = data.address + ", " + data.ward + ", " + data.province;
    setAddress(newData);
    form.setFieldValue("address", newData);
    setShowAddressForm(false);
  };

  return (
    <>
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
          <Input />
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
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <div className="flex gap-2">
            <Input
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                form.setFieldValue("address", e.target.value);
              }}
            />
            <Button onClick={() => setShowAddressForm(true)} type="primary">
              Chọn địa chỉ
            </Button>
          </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu bệnh nhân
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Thêm địa chỉ"
        open={showAddressForm}
        onCancel={() => setShowAddressForm(false)}
        footer={null}
      >
        <AddressForm onSuccess={handleSuccess} onClose={handleClose} />
      </Modal>
    </>
  );
}
