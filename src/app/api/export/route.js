import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const patients = await prisma.patient.findMany();

        // Định nghĩa tên cột tùy chỉnh
        const formattedPatients = patients.map(patient => ({
            'Số thứ tự Bệnh Nhân': patient.id,
            'Tên Bệnh Nhân': patient.name,
            'Năm sinh': patient.dateOfBirth,
            'Giới tính': patient.gender,
            'Địa chỉ': patient.address,
            'Số điện thoại': patient.phone,
            'Ngày khám đầu tiên': patient.createdAt,
        }));

        // Tạo workbook và worksheet
        const workBook = XLSX.utils.book_new();
        const workSheet = XLSX.utils.json_to_sheet(formattedPatients);
        XLSX.utils.book_append_sheet(workBook, workSheet, 'DANH SACH');

        // Xuất file Excel
        const buffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' });
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=patients.xlsx',
            },
        });
    } catch (error) {
        console.error(error);
        return new NextResponse('Error exporting data', { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}