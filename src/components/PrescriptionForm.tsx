"use client";

import {
  Form,
  Button,
  Select,
  Input,
  InputNumber,
  DatePicker,
  Space,
  Modal,
} from "antd";
import { useState, useEffect } from "react";
import PatientSelector from "./PatientSelector";
import { Diagnosis } from "../types/Diagnosis";
import { Medicine } from "@prisma/client";

const DIAGNOSES = [
  { id: 1, code: "A01", description: "Sốt xuất huyết" },
  { id: 2, code: "B02", description: "Viêm họng" },
];

const MEDICINES = [
  { id: 1, name: "Paracetamol 500mg" },
  { id: 2, name: "Amoxicillin 500mg" },
];

export default function PrescriptionForm({
  onSuccess,
  onCancel,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  useEffect(() => {
    fetchDiagnoses();
    fetchMedicines();
  }, []);
  const fetchDiagnoses = async () => {
    const response = await fetch("/api/diagnoses");
    const data = await response.json();
    setDiagnoses(data);
  };
  const fetchMedicines = async () => {
    const response = await fetch("/api/medicines");
    const data = await response.json();
    setMedicines(data);
  };
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState<string | undefined>(undefined);
  const [medicineId, setMedicineId] = useState<string | undefined>(undefined);
  const [diagnosisIds, setDiagnosisIds] = useState<string[]>([]);

  const onFinish = (values: any) => {
    const data = {
      patientId: values.patientId,
      diagnosisIds: values.diagnosisIds,
      medicines: values.medicines,
      advice: values.advice,
      followUpDate: values.followUpDate,
    };
    setLoading(true);
    console.log(data);
    setLoading(false);
    form.resetFields();
    if (onSuccess) onSuccess();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        medicines: [{ medicineId: undefined, quantity: 1, instruction: "" }],
      }}
    >
      {/* 1. Chọn bệnh nhân */}
      <Form.Item
        label="Bệnh nhân"
        name="patientId"
        rules={[{ required: true, message: "Vui lòng chọn bệnh nhân." }]}
      >
        <PatientSelector
          value={patientId}
          onChange={(value) => setPatientId(value)}
        />
      </Form.Item>

      {/* 2. Chẩn đoán */}
      <Form.Item
        label="Chẩn đoán"
        name="diagnosisIds"
        rules={[
          { required: true, message: "Vui lòng chọn ít nhất 1 chẩn đoán." },
        ]}
      >
        <Select
          mode="multiple" // Nếu bạn muốn chọn nhiều, giữ lại dòng này, nếu không thì bỏ đi
          showSearch
          placeholder="Nhập mã, tên bệnh"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={diagnoses.map((d) => ({
            value: d.id,
            label: `${d.code} - ${d.description}`, // label chứa cả mã và mô tả
          }))}
          style={{ width: "100%" }}
          onChange={(value) => setDiagnosisIds(value)}
        />
      </Form.Item>

      {/* 3. Danh sách thuốc */}
      <Form.List name="medicines">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name={[name, "medicineId"]}
                  rules={[{ required: true, message: "Chọn thuốc" }]}
                >
                  <Select
                    placeholder="Thuốc"
                    options={medicines.map((m) => ({
                      value: m.id,
                      label: m.name,
                    }))}
                    value={medicineId}
                    onChange={(value) => setMedicineId(value)}
                    style={{ width: 170 }}
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "quantity"]}
                  rules={[{ required: true, message: "SL" }]}
                >
                  <InputNumber min={1} placeholder="SL" style={{ width: 60 }} />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "instruction"]}
                  rules={[{ required: true, message: "Cách dùng" }]}
                >
                  <Input placeholder="Cách dùng" style={{ width: 150 }} />
                </Form.Item>
                <Button danger type="link" onClick={() => remove(name)}>
                  Xoá
                </Button>
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block>
                ➕ Thêm thuốc
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* 4. Ghi chú và ngày tái khám */}
      <Form.Item label="Lời dặn bác sĩ" name="advice">
        <Input.TextArea
          rows={2}
          placeholder="Nhập lời dặn dành cho bệnh nhân nếu cần"
        />
      </Form.Item>
      <Form.Item label="Ngày tái khám" name="followUpDate">
        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
      </Form.Item>

      {/* Nút submit & Cancel */}
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu đơn thuốc
          </Button>
          {onCancel && (
            <Button onClick={onCancel} disabled={loading}>
              Đóng
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
}
