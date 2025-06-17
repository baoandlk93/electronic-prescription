"use client";

import { Select } from "antd";

export default function PatientSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select
      placeholder="Chọn bệnh nhân"
      options={[
        { label: "Nguyễn Văn A", value: "1" },
        { label: "Trần Thị B", value: "2" },
      ]}
      value={value}
      onChange={onChange}
    />
  );
}
