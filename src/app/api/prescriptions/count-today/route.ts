import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    // Lấy thời gian bắt đầu và kết thúc của ngày hôm nay (theo giờ máy chủ)
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const count = await prisma.prescription.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });

    return Response.json({ count });
  } catch (error: any) {
    return Response.json({
      error: 'Lỗi khi lấy số lượng đơn thuốc trong ngày',
      details: error.message
    }, { status: 500 });
  }
}
