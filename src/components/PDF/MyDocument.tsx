import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import { PaperSize } from "@/types/PaperSize";
import { PrescriptionDetail } from "@/types/PrescriptionDetail";

// Đăng ký font Roboto hỗ trợ tiếng Việt
Font.register({
  family: "Roboto",
  src: "Roboto/static/Roboto-Regular.ttf",
  fontStyle: "normal",
  fontWeight: "normal",
});
Font.register({
  family: "Roboto",
  src: "Roboto/static/Roboto-Bold.ttf",
  fontWeight: "bold",
});
Font.register({
  family: "Roboto",
  src: "Roboto/static/Roboto-Italic.ttf",
  fontStyle: "italic",
});

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 12,
    padding: 24,
    backgroundColor: "#fff",
  },
  headerClinic: {
    fontSize: 11,
    marginBottom: 4,
    textAlign: "left",
    flexDirection: "row",
    gap: 6,
  },
  clinicName: { fontSize: 13, fontWeight: "bold" },
  clinicSub: { fontStyle: "italic", fontSize: 10 },
  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 8,
  },
  box: {
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 3,
    padding: 8,
    marginBottom: 10,
  },
  row: { flexDirection: "row", marginBottom: 2 },
  colLeft: { width: "24%" },
  col: { width: "38%" },
  bold: { fontWeight: "bold" },
  tableHeader: {
    flexDirection: "row",
    fontWeight: "bold",
    borderBottomWidth: 1,
    marginBottom: 3,
    backgroundColor: "#efefef",
    paddingVertical: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    alignItems: "flex-start",
    paddingVertical: 2,
  },
  thStt: { width: "7%", textAlign: "center" },
  thName: { width: "30%" },
  thQty: { width: "10%", textAlign: "center" },
  thUnit: { width: "11%", textAlign: "center" },
  thNote: { width: "42%" },
  signature: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureText: { fontSize: 12, fontStyle: "italic" },
  footer: {
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 14,
    fontSize: 12,
  },
  watermark: {
    position: "absolute",
    top: "46%",
    left: "15%",
    opacity: 0.15,
    fontSize: 32,
    color: "#B8B690",
    fontWeight: "bold",
    transform: "rotate(-18deg)",
    zIndex: 0,
  },
});
// Main component
export const MyDocument = ({
  prescriptionDetails,
  size,
}: {
  prescriptionDetails: PrescriptionDetail | null;
  size: PaperSize;
}) => (
  <Document language="vi">
    <Page size={size} style={styles.page} wrap>
      {/* Watermark chìm */}
      <Text style={styles.watermark}>tinnghe.com</Text>

      {/* Header phòng khám */}
      <View style={styles.headerClinic}>
        <View style={{ flex: 1 }}>
          <Text style={styles.clinicName}>
            Phòng Khám Bác sỹ Huỳnh Minh Tâm
          </Text>
          <Text>
            Địa chỉ: 207A Hoàng Văn Thụ, Phương Sài, Nha Trang, Khánh Hòa, Việt
            Nam
          </Text>
          <Text>ĐT: 0983314039</Text>
          <Text style={styles.clinicSub}>(Phòng khám chuyên khoa nội)</Text>
        </View>
      </View>

      {/* Tiêu đề */}
      <Text style={styles.title}>ĐƠN THUỐC</Text>
      {/* barcode (nếu cần) */}
      {/* <Image src={barcodeUrl} style={{ width: 130, height: 30, alignSelf: "center" }} /> */}

      {/* Khung thông tin */}
      <View style={styles.box}>
        {/* Dòng 1: Mã BN, ngày, mã đơn */}
        <View style={styles.row}>
          <Text style={{ width: "50%" }}>
            <Text style={styles.bold}>Mã đơn:</Text> {prescriptionDetails?.code}
          </Text>
          <Text style={{ width: "50%" }}>
            <Text style={styles.bold}>Ngày:</Text>{" "}
            {prescriptionDetails?.createdAt &&
              dayjs(prescriptionDetails.createdAt).format("DD/MM/YYYY HH:mm")}
          </Text>
        </View>
        {/* Dòng 2: Họ tên, SN/tuổi/GT */}
        <View style={styles.row}>
          <Text style={{ width: "50%" }}>
            <Text style={styles.bold}>Họ tên:</Text>{" "}
            <Text>{prescriptionDetails?.patient?.name}</Text>
          </Text>
          <Text style={{ width: "25%" }}>
            <Text style={styles.bold}>Năm sinh:</Text>{" "}
            <Text>
              {prescriptionDetails?.patient?.dateOfBirth &&
                dayjs(prescriptionDetails?.patient?.dateOfBirth).format("YYYY")}
            </Text>
          </Text>
          <Text style={{ width: "25%" }}>
            <Text style={styles.bold}> Giới tính:</Text>{" "}
            {prescriptionDetails?.patient?.gender === "male"
              ? "Nam"
              : prescriptionDetails?.patient?.gender === "female"
              ? "Nữ"
              : "Khác"}
          </Text>
        </View>
        {/* Dòng 3: Địa chỉ, ĐT */}
        <View style={styles.row}>
          <Text style={{ width: "50%" }}>
            <Text style={styles.bold}>Địa chỉ:</Text>{" "}
            {prescriptionDetails?.patient?.address}
          </Text>
          <Text style={{ width: "50%" }}>
            <Text style={styles.bold}>ĐT:</Text>{" "}
            {prescriptionDetails?.patient?.phone}
          </Text>
        </View>
        {/* Dòng 4: Chẩn đoán */}
        <View style={styles.row}>
          <Text style={{ width: "100%" }}>
            <Text style={styles.bold}>Chẩn đoán:</Text>{" "}
            {prescriptionDetails?.diagnoses
              ?.map((d) => d.diagnosis.name)
              .join("\n")}
          </Text>
        </View>
      </View>

      {/* BẢNG thuốc */}
      <View style={styles.box}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.thStt}>STT</Text>
          <Text style={styles.thName}>Mặt hàng thuốc, vật tư</Text>
          <Text style={styles.thQty}>SL</Text>
          <Text style={styles.thUnit}>ĐV</Text>
          <Text style={styles.thNote}>Cách dùng</Text>
        </View>
        {/* Table Rows */}
        {prescriptionDetails?.items?.map((item, idx) => (
          <View key={item.id || idx} style={styles.tableRow}>
            <Text style={styles.thStt}>{idx + 1}</Text>
            <Text style={styles.thName}>{item?.medicine?.name}</Text>
            <Text style={styles.thQty}>{item?.quantity}</Text>
            <Text style={styles.thUnit}>{item?.medicine?.unit}</Text>
            <Text style={styles.thNote}>
              {item?.instruction || item?.instruction}
            </Text>
          </View>
        ))}
      </View>

      {/* Tái khám + Lời dặn */}
      <Text>
        <Text style={styles.bold}>Tái khám:</Text>{" "}
        {prescriptionDetails?.followUpDate &&
          dayjs(prescriptionDetails.followUpDate).format("DD/MM/YYYY")}
      </Text>
      <Text style={{ marginTop: 3, marginBottom: 2 }}>
        <Text style={styles.bold}>Lời dặn bệnh nhân:</Text>
      </Text>
      <View style={{ marginLeft: 8, marginBottom: 3 }}>
        <Text>{prescriptionDetails?.advice}</Text>
      </View>

      {/* Ghi chú & chữ ký */}
      <View style={styles.signature}>
        <Text style={{ width: "55%" }}></Text>
        <View style={{ alignItems: "center" }}>
          <Text>Bác sĩ</Text>
          <Text style={styles.signatureText}>(Ký, Họ tên)</Text>
          <Text style={{ marginTop: 32 }}>Huỳnh Minh Tâm</Text>
        </View>
      </View>
      {/* Ghi chú */}
      <Text style={{ marginTop: 8 }}>
        <Text style={styles.bold}>Ghi chú:</Text>
      </Text>
      <Text style={{ fontStyle: "italic", marginLeft: 8 }}>
        Uống thuốc đúng hướng dẫn Bác sỹ và tái khám đúng hẹn!
      </Text>
    </Page>
  </Document>
);
