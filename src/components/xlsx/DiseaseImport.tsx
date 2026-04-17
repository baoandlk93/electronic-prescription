import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import React from "react";
import { toast } from "react-toastify";

const DiseaseImport = ({
  onImport,
  loading,
}: {
  onImport: (diseases: any[]) => void;
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

      const headers = data[4] as string[];
      const rows = data.slice(5);

      if (rows.length === 0) {
        toast.error("Không có dữ liệu dưới tiêu đề!");
        return;
      }

      const col_Ma = headers.findIndex((h) => h === "Mã");
      const col_TenBenh = headers.findIndex((h) => h === "Tên bệnh ");
      const col_MoTa = headers.findIndex((h) => h === "Mô tả");

      if (col_Ma === -1 || col_TenBenh === -1 || col_MoTa === -1) {
        toast.error(
          "Một trong các cột 'Mã', 'Tên bệnh', 'Mô tả' không tồn tại!",
        );
        return;
      }

      const diseases = rows
        .filter((row) => row && (row[col_Ma] || row[col_TenBenh]))
        .map((row) => ({
          code: String(row[col_Ma] ?? ""),
          name: String(row[col_TenBenh] ?? ""),
          description: String(row[col_MoTa] ?? ""),
        }));

      onImport(diseases);
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
        Import danh mục bệnh (Excel)
      </Button>
    </Upload>
  );
};

export default DiseaseImport;
