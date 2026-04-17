import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const items = await req.json();

        if (!Array.isArray(items) || items.length === 0) {
            return Response.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
        }

        const data = items
            .filter((d) => d.name)
            .map((d) => ({
                name: String(d.name),
                content: String(d.content ?? ''),
                unit: String(d.unit ?? ''),
            }));

        const result = await prisma.medicine.createMany({
            data,
            skipDuplicates: true,
        });

        return Response.json({ count: result.count });
    } catch (err) {
        return Response.json({ error: 'Lỗi khi import thuốc', details: err }, { status: 500 });
    }
}
