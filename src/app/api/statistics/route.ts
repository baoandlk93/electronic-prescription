import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'day';
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  let groupBy: 'day' | 'month' | 'year' = 'day';
  if (type === 'month') groupBy = 'month';
  if (type === 'year') groupBy = 'year';

  const startDate = start ? new Date(start) : new Date('2023-01-01');
  const endDate = end ? new Date(end) : new Date();

  const formatMap = {
    day: '%Y-%m-%d',
    month: '%Y-%m',
    year: '%Y',
  };
  const format = formatMap[groupBy];

  // Prescription thống kê theo createAt
  const prescriptionStats = await prisma.$queryRawUnsafe(
    `SELECT DATE_FORMAT(createdAt, '${format}') as time, COUNT(*) as count
     FROM Prescription
     WHERE createdAt BETWEEN ? AND ?
     GROUP BY time
     ORDER BY time`,
    startDate, endDate
  ) as Array<{ time: string; count: number }>;

  // Tổng số bệnh nhân (không thể thống kê theo ngày/tháng/năm do không có createAt)
  const patientCountResult = await prisma.patient.count(); // tổng số bệnh nhân hiện tại

  // Đáp ứng data như sau:
  // - Nếu cần trả về dạng array giống cũ (phân theo thời gian Prescription)
  // - Trả về cùng patients (tổng số) cho mỗi thời điểm (nếu muốn)
  const data = prescriptionStats.map(stat => 
    parseBigInt({
      time: stat.time,
      patients: patientCountResult,
      prescriptions: stat.count,
    })
);


  return Response.json(data);
}
function parseBigInt(obj: any) {
    const res: any = {};
    for (const key in obj) {
      res[key] = typeof obj[key] === 'bigint' ? Number(obj[key]) : obj[key];
    }
    return res;
  }