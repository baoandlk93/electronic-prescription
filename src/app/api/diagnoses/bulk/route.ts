import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const items = await req.json();

        if (!Array.isArray(items) || items.length === 0) {
            return Response.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
        }

        // Lọc hợp lệ, deduplicate theo code (giữ bản ghi đầu tiên)
        const seen = new Set<string>();
        const data = items
            .filter((d) => d.name && d.code)
            .map((d) => ({
                name: String(d.name),
                code: String(d.code).trim(),
                description: String(d.description ?? ''),
            }))
            .filter((d) => {
                if (seen.has(d.code)) return false;
                seen.add(d.code);
                return true;
            });

        const result = await prisma.diagnosis.createMany({
            data,
            skipDuplicates: true,
        });

        return Response.json({ count: result.count });
    } catch (err) {
        return Response.json({ error: 'Lỗi khi import bệnh', details: err }, { status: 500 });
    }
}
