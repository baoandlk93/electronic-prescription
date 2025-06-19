import { AutoComplete, Input } from "antd";
import { useState } from "react";
import dayjs from "dayjs";

// props: hàm onSelectPrescription lấy id đơn thuốc khi chọn
export default function PrescriptionAutoComplete({ onSelectPrescription }) {
  const [options, setOptions] = useState([]);

  const handleSearch = async (value) => {
    if (!value || value.length < 2) {
      setOptions([]);
      return;
    }

    // Suggest API, chỉnh path API nếu cần
    const res = await fetch(
      `/api/prescriptions/suggest?query=${encodeURIComponent(value)}`
    );
    if (res.ok) {
      const data = await res.json();
      setOptions(
        (data || []).map((p) => ({
          value: p.id, // Giá trị thực tế là id đơn thuốc
          label: (
            <div>
              <b>{p.code}</b> – {p.patientName}{" "}
              <span style={{ color: "#888", marginLeft: 8 }}>
                {dayjs(p.createdAt).format("DD/MM/YYYY")}
              </span>
            </div>
          ),
        }))
      );
    }
  };

  return (
    <AutoComplete
      style={{ width: 400, marginBottom: 20 }}
      options={options}
      onSearch={handleSearch}
      placeholder="Tìm đơn thuốc theo tên bệnh nhân, mã hoặc ngày"
      filterOption={false}
      onSelect={(id) => onSelectPrescription(id)}
      allowClear
    >
      <Input />
    </AutoComplete>
  );
}
