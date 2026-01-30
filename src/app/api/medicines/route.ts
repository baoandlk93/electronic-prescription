import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.mã || !data.tên_thuốc || !data.đơn_vị) {
      return Response.json(
        { error: 'Thiếu trường dữ liệu (mã, tên thuốc, đơn vị) là bắt buộc.' },
        { status: 400 }
      );
    }

    const medicine = await prisma.medicine.create({
      data: {
        name: data.tên_thuốc,
        content: data.hàm_lượng,
        unit: data.đơn_vị,
      }
    });
    return Response.json(medicine);
  } catch (err) {
    return Response.json({ error: 'Lỗi khi thêm thuốc', details: err }, { status: 500 });
  }
}

export async function GET() {
  try {
    const medicines = await prisma.medicine.findMany();
    return Response.json(medicines);
  } catch (err) {
    return Response.json({ error: 'Lỗi khi lấy danh sách thuốc', details: err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...rest } = data;
    const medicine = await prisma.medicine.update({
      where: { id: Number(id) },
      data: rest,
    });
    return Response.json(medicine);
  } catch (err) {
    return Response.json({ error: 'Lỗi khi cập nhật thuốc', details: err }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.medicine.delete({ where: { id: Number(id) } });
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: 'Lỗi khi xóa thuốc', details: err }, { status: 500 });
  }
}
