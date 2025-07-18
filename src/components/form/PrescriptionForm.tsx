"use client";

import {
  Form,
  Button,
  Select,
  Input,
  InputNumber,
  DatePicker,
  Space,
} from "antd";
import { useState, useEffect } from "react";
import PatientSelector from "../PatientSelector";
import { DiagnosisDetail } from "../../types/DiagnosisDetail";
import { Medicine } from "../../types/Medicine";
import { PrescriptionDetail } from "../../types/PrescriptionDetail";
import dayjs from "dayjs";
import { toast } from "react-toastify";

// Hàm chuẩn hoá dữ liệu initialValues cho Form
function normalizeInitialValues(pres?: PrescriptionDetail | null) {
  if (!pres) return undefined;
  return {
    patientId: pres.patient?.id,
    diagnosisIds: pres.diagnoses
      ? pres.diagnoses.map((d: any) => d.diagnosisId || d.id)
      : [],
    symptom: pres.symptom ?? "",
    medicines: pres.items
      ? pres.items.map((item: any) => ({
          medicineId: item.medicineId || item.id,
          quantity: item.quantity,
          instruction: item.instruction,
        }))
      : [],
    advice: pres.advice ?? "",
    followUpDate: pres.followUpDate ? dayjs(pres.followUpDate) : null,
  };
}

export default function PrescriptionForm({
  onSuccess,
  onCancel,
  editingPrescription,
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
  editingPrescription?: PrescriptionDetail | null;
}) {
  const [diagnoses, setDiagnoses] = useState<DiagnosisDetail[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  // Load danh sách chẩn đoán + thuốc một lần
  useEffect(() => {
    fetchDiagnoses();
    fetchMedicines();
  }, []);
  const fetchDiagnoses = async () => {
    const response = await fetch("/api/diagnoses");
    setDiagnoses(await response.json());
  };
  const fetchMedicines = async () => {
    const response = await fetch("/api/medicines");
    setMedicines(await response.json());
  };

  // Khi editingPrescription thay đổi, set lại initialValues cho form
  useEffect(() => {
    form.resetFields();
    const initial = normalizeInitialValues(editingPrescription);
    if (initial) {
      form.setFieldsValue(initial);
    } else {
      form.setFieldsValue({
        patientId: undefined,
        code: "",
        diagnosisIds: [],
        symptom: "",
        medicines: [],
        advice: "",
        followUpDate: null,
      });
    }
  }, [editingPrescription, form]);
  // Hàm lấy ngày hôm nay dưới dạng string
  function getTodayStr() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  }

  // Khi component mount lên
  useEffect(() => {
    const lastDate = localStorage.getItem("counter-date");
    const savedCount = parseInt(localStorage.getItem("counter") || "0", 10);
    const today = getTodayStr();

    if (lastDate === today) {
      setCount(savedCount);
    } else {
      setCount(0);
      localStorage.setItem("counter", "0");
      localStorage.setItem("counter-date", today);
    }
  }, []);

  // Hàm tăng số đếm
  const handleIncrease = () => {
    const today = getTodayStr();
    const lastDate = localStorage.getItem("counter-date");
    let currCount = 0;
    if (lastDate === today) {
      currCount = parseInt(localStorage.getItem("counter") || "0", 10) + 1;
    } else {
      currCount = 1;
      localStorage.setItem("counter-date", today);
    }
    setCount(currCount);
    localStorage.setItem("counter", currCount.toString());
  };

  // Submit
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...(editingPrescription?.id ? { id: editingPrescription.id } : {}),
        ...(editingPrescription?.code
          ? { code: editingPrescription.code }
          : {
              code: `HMT${dayjs().format("DDMMYYYY")}${count}`,
            }),
        patientId: values.patientId,
        diagnosisIds: values.diagnosisIds,
        symptom: values.symptom,
        medicines: values.medicines,
        advice: values.advice,
        followUpDate: values.followUpDate
          ? values.followUpDate.toISOString()
          : null,
      };
      await fetch(`/api/prescriptions`, {
        method: editingPrescription?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      toast.success(
        editingPrescription?.id
          ? "Cập nhật đơn thuốc thành công!"
          : "Tạo mới đơn thuốc thành công!"
      );
      form.resetFields();
      handleIncrease();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Có lỗi khi lưu đơn thuốc");
    }
    setLoading(false);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={normalizeInitialValues(editingPrescription)}
    >
      {/* 1. Chọn bệnh nhân */}
      <Form.Item
        label="Bệnh nhân"
        name="patientId"
        rules={[{ required: true, message: "Vui lòng chọn bệnh nhân." }]}
      >
        <PatientSelector
          value={form.getFieldValue("patientId")}
          onChange={(value) => form.setFieldValue("patientId", value)}
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
          mode="multiple"
          showSearch
          placeholder="Nhập mã, tên bệnh"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={diagnoses.map((d) => ({
            value: d.id,
            label: `${d.code} - ${d.name}`,
          }))}
          style={{ width: "100%" }}
        />
      </Form.Item>

      {/* 2. Danh sách thuốc */}
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
                    showSearch
                    placeholder="Thuốc"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={medicines.map((m) => ({
                      value: m.id,
                      label: m.name,
                    }))}
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

      {/* 3. Ghi chú và ngày tái khám */}
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
            {editingPrescription?.id ? "Cập nhật đơn thuốc" : "Lưu đơn thuốc"}
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
