import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
export async function POST(request: Request) {
    const { identity, password } = await request.json();

    if (!identity || !password) {
        return Response.json(
            { error: 'Vui lòng nhập đầy đủ thông tin đăng nhập.' },
            { status: 400 }
        );
    }

    let user = null;

    // Kiểm tra xem identity là email hay username
    const isEmail = /^\S+@\S+\.\S+$/.test(identity);
    if (isEmail) {
        user = await prisma.user.findUnique({ where: { email: identity } });
    } else {
        user = await prisma.user.findUnique({ where: { username: identity } });
    }

    if (!user) {
        return Response.json({ error: 'Tài khoản không tồn tại' }, { status: 401 });
    }

    // Kiểm tra mật khẩu (lưu ý thực tế nên so sánh bằng hash, không phải plain text)
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return Response.json({ error: 'Mật khẩu không chính xác' }, { status: 401 });
    }
const responseUser = {
    id: user.id,
    username: user.username,
    email: user.email,
}

    return Response.json(responseUser); // Lưu ý không trả về password
}
