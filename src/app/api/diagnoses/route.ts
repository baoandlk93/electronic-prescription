import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
      const data = await req.json();
  
      if (!data.name || !data.code || !data.description) {
        return Response.json(
          { error: 'Thiếu trường dữ liệu (name, code, description) là bắt buộc.' },
          { status: 400 }
        );
      }
  
      const diagnosis = await prisma.diagnosis.create({ data });
      return Response.json(diagnosis);
    } catch (err) {
      return Response.json({ error: 'Lỗi khi thêm bệnh', details: err }, { status: 500 });
    }
  }

export async function GET() {
  try {
    const diagnosis = await prisma.diagnosis.findMany();
    return Response.json(diagnosis);
  } catch (err) {
    return Response.json({ error: 'Lỗi khi lấy danh sách bệnh', details: err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...rest } = data;
    const diagnosis = await prisma.diagnosis.update({
      where: { id: Number(id) },
      data: rest,
    });
    return Response.json(diagnosis);
  } catch (err) {
    return Response.json({ error: 'Lỗi khi cập nhật bệnh', details: err }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.diagnosis.delete({ where: { id: Number(id) } });
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: 'Lỗi khi xóa bệnh', details: err }, { status: 500 });
  }
}
