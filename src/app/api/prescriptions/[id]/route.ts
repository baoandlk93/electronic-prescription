import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET đơn thuốc theo id
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Thiếu ID đơn thuốc' }, { status: 400 });
  }

  const prescription = await prisma.prescription.findUnique({
    where: { id: Number(id) },
    include: {
      patient: true,
      diagnoses: {
        include: { diagnosis: true }
      },
      items: {
        include: { medicine: true }
      }
    }
  });

  if (!prescription) {
    return NextResponse.json({ error: 'Không tìm thấy đơn thuốc' }, { status: 404 });
  }

  return NextResponse.json(prescription);
}

// DELETE đơn thuốc theo id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'Thiếu hoặc sai ID đơn thuốc' }, { status: 400 });
  }

  try {
    await prisma.prescriptionDiagnosis.deleteMany({
      where: { prescriptionId: id },
    });

    await prisma.prescriptionMedicine.deleteMany({
      where: { prescriptionId: id },
    });

    await prisma.prescription.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Không tìm thấy đơn thuốc' }, { status: 404 });
    }
    return NextResponse.json({
      error: 'Lỗi khi xoá đơn thuốc',
      details: error?.message || error,
    }, { status: 500 });
  }
}
