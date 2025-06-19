// /api/prescriptions/suggest
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('query')?.trim() || '';

  if (q.length < 2) return NextResponse.json([]);

  const prescriptions = await prisma.prescription.findMany({
    where: {
      OR: [
        { code: { contains: q } },
        { patient: { name: { contains: q } } },
      ]
    },
    include: { patient: true },
    take: 8,
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(
    prescriptions.map(p => ({
      id: p.id,
      code: p.code,
      patientName: p.patient?.name || "",
      createdAt: p.createdAt
    }))
  );
}
