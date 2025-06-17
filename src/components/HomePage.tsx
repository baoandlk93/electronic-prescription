"use client";
import { useRouter } from "next/navigation";
export default function HomePage() {
  const router = useRouter();
  const handlePatientClick = () => {
    router.push("/patient");
  };
  const handleMedicineClick = () => {
    router.push("/medicine");
  };
  const handlePrescriptionClick = () => {
    router.push("/prescription");
  };
  return (
    <div className="flex flex-col min-h-screen overflow-auto">
      <h1 className="text-2xl font-bold mb-4" style={{ textAlign: "center" }}>
        Phần mềm quản lý Phòng Khám
      </h1>
      <p style={{ textAlign: "center" }}>
        Quản lý bệnh nhân, đơn thuốc và thuốc hiệu quả, tiết kiệm thời gian.
      </p>
      <div className="flex justify-center mt-4" style={{ textAlign: "center" }}>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 cursor-pointer"
          onClick={handlePatientClick}
        >
          Quản lý bệnh nhân
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 cursor-pointer"
          onClick={handleMedicineClick}
        >
          Quản lý thuốc
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 cursor-pointer"
          onClick={handlePrescriptionClick}
        >
          Quản lý đơn thuốc
        </button>
      </div>
    </div>
  );
}
