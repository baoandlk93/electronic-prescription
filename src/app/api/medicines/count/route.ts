import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.medicine.count();
    return Response.json({ count });
  } catch (error: Error | unknown) {
    return Response.json({ 
      error: 'Lỗi khi lấy số lượng thuốc', 
      details: error
    }, { status: 500 });
  }
}
