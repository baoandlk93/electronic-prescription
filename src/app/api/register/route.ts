import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
export async function POST(request: Request) {
    const { username,email,password } = await request.json();
    if (!username || !password || !email) {
        return Response.json({ error: 'Thiếu thông tin đăng nhập' }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (user) {
        return Response.json({ error: 'Tài khoản đã tồn tại' }, { status: 401 });
    }
    const user2 = await prisma.user.findUnique({ where: { username: username } });
    if (user2) {
        return Response.json({ error: 'Tài khoản đã tồn tại' }, { status: 401 });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        return Response.json({
            error: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.'
        }, { status: 400 });
    }
    
    await prisma.user.create({
        data: {
            username: username,
            password: passwordHash,
            email: email,
        },
    });
    return Response.json({
        success: true,
    });
}