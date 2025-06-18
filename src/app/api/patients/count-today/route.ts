import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Lấy ngày hiện tại và ngày cách đây 3 ngày
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    // Đếm số bệnh nhân tạo mới từ threeDaysAgo đến hiện tại
    const count = await prisma.patient.count({
      where: {
        createdAt: {
          gte: threeDaysAgo,
          lte: today,
        },
      },
    });

    return Response.json(count);
  } catch (error: any) {
    return Response.json({ 
      error: 'Lỗi khi lấy số lượng bệnh nhân mới', 
      details: error?.message 
    }, { status: 500 });
  }
}
