import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import React from "react";
import { toast } from "react-toastify";

const MedicineImport = ({
  onImport,
}: {
  onImport: (medicines: any[]) => void;
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

      // Xác định vị trí các cột cần lấy (B, C, L)
      const col_Ma = headers.findIndex((h) => h === "MA_THUOC_BV");
      const col_TenThuoc = headers.findIndex((h) => h === "TEN_THUOC");
      const col_HamLuong = headers.findIndex((h) => h === "HAM_LUONG");
      const col_DonVi = headers.findIndex((h) => h === "DON_VI_TINH");

      if (col_Ma === -1 || col_TenThuoc === -1 || col_HamLuong === -1 || col_DonVi === -1) {
        toast.error(
            "Một trong các cột 'MA_THUOC_BV', 'TEN_THUOC', 'HAM_LUONG', 'DON_VI_TINH' không tồn tại!"
        );
        return;
      }

      // Duyệt từng dòng, chỉ lấy 3 cột cần thiết
      const medicines = rows
        .filter(
          (row) => row && (row[col_Ma] || row[col_TenThuoc] || row[col_HamLuong] || row[col_DonVi])
        )
        .map((row) => ({
          mã: row[col_Ma] ?? "",
          tên_thuốc: row[col_TenThuoc] ?? "",
          đơn_vị: row[col_DonVi] ?? "",
          hàm_lượng: row[col_HamLuong] ?? "",
        }));

      toast.success("Import file Excel thành công");
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
    >
      <Button icon={<UploadOutlined />}>Import danh mục Thuốc (Excel)</Button>
    </Upload>
  );
};

export default MedicineImport;
