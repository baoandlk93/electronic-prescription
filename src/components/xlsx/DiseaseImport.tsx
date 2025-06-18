import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import React from "react";
import { toast } from "react-toastify";

const DiseaseImport = ({
  onImport,
}: {
  onImport: (diseases: any[]) => void;
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

      console.log(data, "data");

      const headers = data[4] as string[];
      const rows = data.slice(5);

      if (rows.length === 0) {
        toast.error("Không có dữ liệu dưới tiêu đề!");
        return;
      }

      // Xác định vị trí các cột cần lấy (B, C, L)
      const col_Ma = headers.findIndex((h) => h === "Mã");
      const col_TenBenh = headers.findIndex((h) => h === "Tên bệnh ");
      const col_MoTa = headers.findIndex((h) => h === "Mô tả");
      console.log(col_Ma, col_TenBenh, col_MoTa, "col");

      if (col_Ma === -1 || col_TenBenh === -1 || col_MoTa === -1) {
        toast.error(
          "Một trong các cột 'Mã', 'Tên bệnh', 'Mô tả' không tồn tại!"
        );
        return;
      }

      // Duyệt từng dòng, chỉ lấy 3 cột cần thiết
      const diseases = rows
        .filter(
          (row) => row && (row[col_Ma] || row[col_TenBenh] || row[col_MoTa])
        )
        .map((row) => ({
          mã: row[col_Ma] ?? "",
          tên_bệnh: row[col_TenBenh] ?? "",
          mô_tả: row[col_MoTa] ?? "",
        }));

      toast.success("Import file Excel thành công");
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
    >
      <Button icon={<UploadOutlined />}>Import danh mục bệnh (Excel)</Button>
    </Upload>
  );
};

export default DiseaseImport;
