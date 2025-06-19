import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const searchParams = req.url.split("?")[1];
    console.log(searchParams);
    const limit = Number(searchParams?.split("limit=")[1].split("&")[0]) || 100;
    const offset = Number(searchParams?.split("offset=")[1].split("&")[0]) || 0;
    
    const prescriptions = (await prisma.prescription.findMany(
      {
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          patient: true,
          diagnoses: {
            include: { diagnosis: true }
          },
          items: {
            include: { medicine: true }
          }
        }
      }
    ));
    return NextResponse.json(prescriptions);
}

export async function POST(req: Request) {
    try {
      // Gỉả sử data truyền lên từ body
      const { code, patientId, diagnosisIds, medicines, advice, followUpDate } = await req.json();

      const prescription = await prisma.prescription.create({
        data: {
          code,
          patientId,
          advice,
          followUpDate,
          // Tạo prescriptionDiagnosis quaẩn hệ
          diagnoses: {
            create: diagnosisIds.map(id => ({ diagnosisId: id }))
          },
          items: {
            create: medicines.map(item => ({
              medicineId: item.medicineId,
              quantity: item.quantity,
              instruction: item.instruction
            }))
          }
        },
        include: {
          diagnoses: true,
          items: true
        }
      });

        return Response.json(prescription);
    } catch (err) {
        return Response.json({ error: 'Lỗi khi thêm đơn thuốc', details: err }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
      const data = await req.json();
      const { id, diagnosisIds, medicines, patientId, ...rest } = data;
  
      if (!id) {
        return Response.json({ error: 'Thiếu id đơn thuốc' }, { status: 400 });
      }
  
      // 1. Update prescription chính (không truyền diagnoses/items vì dùng bảng trung gian!)
      const updateData: any = { ...rest };
      if (patientId) {
        updateData.patient = { connect: { id: Number(patientId) } };
      }
      await prisma.prescription.update({
        where: { id: Number(id) },
        data: updateData,
      });
  
      // 2. Cập nhật diagnosis: Xóa toàn bộ, sau đó insert lại
      if (Array.isArray(diagnosisIds)) {
        await prisma.prescriptionDiagnosis.deleteMany({
          where: { prescriptionId: Number(id) },
        });
        if (diagnosisIds.length > 0) {
          await prisma.prescriptionDiagnosis.createMany({
            data: diagnosisIds.map((diagnosisId: number) => ({
              prescriptionId: Number(id),
              diagnosisId: Number(diagnosisId),
              // note: Bạn có muốn hỗ trợ note từ client thì xử lý thêm ở đây!
            })),
          });
        }
      }
  
      // 3. Cập nhật medicine: Xóa toàn bộ, sau đó insert lại
      if (Array.isArray(medicines)) {
        await prisma.prescriptionMedicine.deleteMany({
          where: { prescriptionId: Number(id) },
        });
        if (medicines.length > 0) {
          await prisma.prescriptionMedicine.createMany({
            data: medicines.map((item: any) => ({
              prescriptionId: Number(id),
              medicineId: Number(item.medicineId),
              quantity: Number(item.quantity),
              instruction: item.instruction,
            })),
          });
        }
      }
  
      // 4. Trả về prescription đầy đủ kèm diagnoses và medicines
      const fullPrescription = await prisma.prescription.findUnique({
        where: { id: Number(id) },
        include: {
          // Lấy danh sách diagnosis qua prescriptionDiagnosis luôn
          diagnoses: {
            include: {
              diagnosis: true
            }
          },
          items: {
            include: { medicine: true }
          },
          patient: true,
        },
      });
  
      return Response.json(fullPrescription);
    } catch (err) {
      let errObj = err;
      try {
        errObj = JSON.parse(JSON.stringify(err, (_, v) =>
          typeof v === "bigint" ? v.toString() : v
        ));
      } catch { /* ignore */ }
  
      return Response.json(
        { error: "Lỗi khi cập nhật đơn thuốc", details: errObj },
        { status: 500 }
      );
    }
  }
  


export async function DELETE(req: Request) {
    try {
        const data = await req.json();
        const { id } = data;
        const prescription = await prisma.prescription.delete({
            where: { id: Number(id) },
        });
        return Response.json(prescription);
    } catch (err) {
        return Response.json({ error: 'Lỗi khi xóa đơn thuốc', details: err }, { status: 500 });
    }
}


