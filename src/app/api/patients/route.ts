import { prisma } from "@/lib/prisma";
export async function GET() {
    try {
        const patients = await prisma.patient.findMany({
            include: {
                prescriptions: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { createdAt: true }
                }
            }
        });

        const result = patients
            .map(({ prescriptions, ...p }) => ({
                ...p,
                lastVisitDate: prescriptions[0]?.createdAt ?? null
            }))
            .sort((a, b) => {
                if (!a.lastVisitDate) return 1;
                if (!b.lastVisitDate) return -1;
                return new Date(b.lastVisitDate).getTime() - new Date(a.lastVisitDate).getTime();
            });

        return Response.json(result);
    } catch (err) {
        return Response.json({ error: 'Lỗi khi lấy danh sách bệnh nhân', details: err }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
    
        if (!data.name || !data.address) {
            return Response.json(
                { error: 'Thiếu trường dữ liệu (name, address) là bắt buộc.' },
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
