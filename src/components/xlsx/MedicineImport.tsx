import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import React from "react";
import { toast } from "react-toastify";

const MedicineImport = ({
  onImport,
  loading,
}: {
  onImport: (medicines: any[]) => void;
  loading?: boolean;
}) => {
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const arrayBuffer = evt.target?.result;
      if (!arrayBuffer) return toast.error("Lỗi đọc file");
      const wb = XLSX.read(arrayBuffer, { type: "array" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as (
        | string
        | number
        | undefined
      )[][];

      const headers = data[0] as string[];
      const rows = data.slice(1);

      if (rows.length === 0) {
        toast.error("Không có dữ liệu dưới tiêu đề!");
        return;
      }

      const col_Ma = headers.findIndex((h) => h === "MA");
      const col_TenThuoc = headers.findIndex((h) => h === "TEN");
      const col_HamLuong = headers.findIndex((h) => h === "HAMLUONG");
      const col_DonVi = headers.findIndex((h) => h === "DONVITINH");

      if (
        col_Ma === -1 ||
        col_TenThuoc === -1 ||
        col_HamLuong === -1 ||
        col_DonVi === -1
      ) {
        toast.error(
          "Một trong các cột 'MA', 'TEN', 'HAMLUONG', 'DONVITINH' không tồn tại!",
        );
        return;
      }

      const medicines = rows
        .filter((row) => row && (row[col_Ma] || row[col_TenThuoc]))
        .map((row) => ({
          name: String(row[col_TenThuoc] ?? ""),
          content: String(row[col_HamLuong] ?? ""),
          unit: String(row[col_DonVi] ?? ""),
        }));

      onImport(medicines);
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  return (
    <Upload
      beforeUpload={handleFile}
      showUploadList={false}
      accept=".xlsx,.xls"
      disabled={loading}
    >
      <Button icon={<UploadOutlined />} loading={loading}>
        Import danh mục Thuốc (Excel)
      </Button>
    </Upload>
  );
};

export default MedicineImport;
