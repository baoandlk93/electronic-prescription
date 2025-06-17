import { prisma } from "@/lib/prisma";
export async function GET() {
    try {
        const patients = await prisma.patient.findMany();
        return Response.json(patients);
    } catch (err) {
        return Response.json({ error: 'Lỗi khi lấy danh sách bệnh nhân', details: err }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
    
        if (!data.name || !data.phone || !data.address) {
            return Response.json(
                { error: 'Thiếu trường dữ liệu (name, phone, address) là bắt buộc.' },
                { status: 400 }
            );
        }
    
        const patient = await prisma.patient.create({ data });
        return Response.json(patient);
    } catch (err) {
        return Response.json({ error: 'Lỗi khi thêm bệnh nhân', details: err }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        await prisma.patient.delete({ where: { id: Number(id) } });
        return Response.json({ success: true });
    } catch (err) {
        return Response.json({ error: 'Lỗi khi xóa bệnh nhân', details: err }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const { id, ...rest } = data;
        const patient = await prisma.patient.update({
            where: { id: Number(id) },
            data: rest,
        });
        return Response.json(patient);
    } catch (err) {
        return Response.json({ error: 'Lỗi khi cập nhật bệnh nhân', details: err }, { status: 500 });
    }
}
