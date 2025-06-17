"use client";

import { Select } from "antd";
import { useState, useEffect } from "react";
import { Patient } from "../types/Patient";
import dayjs from "dayjs";

export default function PatientSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [patients, setPatients] = useState<Patient[]>([]);
  useEffect(() => {
    fetchPatients();
  }, []);
  const fetchPatients = async () => {
    const response = await fetch("/api/patients");
    const data = await response.json();
    setPatients(data);
  };
  return (
    <Select
      showSearch
      placeholder="Nhập tên, mã hồ sơ hoặc năm sinh"
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      options={patients.map((p) => ({
        value: p.id,
        label: `${p.name} - ${p.id} - ${dayjs(p.dateOfBirth).format("YYYY")}`,
      }))}
      style={{ width: "100%" }}
      value={value}
      onChange={onChange}
    />
  );
}
