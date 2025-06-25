# ỨNG DỤNG QUẢN LÝ PHÒNG KHÁM

## Mô tả

Đây là ứng dụng giúp phòng khám quản lý bệnh nhân, đơn thuốc, lịch khám, nhân viên và báo cáo. Ứng dụng có giao diện web thân thiện, dễ sử dụng dành cho nhân viên phòng khám.

---

## Tính năng chính

- Quản lý thông tin bệnh nhân
- Quản lý lịch khám và đặt lịch
- Quản lý đơn thuốc, toa thuốc
- Quản lý nhân viên, bác sĩ
- Báo cáo, thống kê doanh thu, lượt khám
- Tích hợp xuất file PDF/Excel các mẫu biểu

---

## Yêu cầu hệ thống

- **Hệ điều hành:** Windows / Linux / Mac OS
- **Node.js:** >= 18.x
- **MySQL:** >= 5.7 hoặc 8.x
- **Trình duyệt:** Chrome, Firefox, Edge
- **Công cụ khác:** git

---

## Hướng dẫn cài đặt

### 1. Tải mã nguồn

Tải mã nguồn ứng dụng về máy từ Github hoặc nhận file nén và giải nén:

### 2. Cài đặt môi trường

```bash
npm install
npx prisma generate     // lệnh khởi tạo prisma client
npx prisma migrate dev  // lệnh khởi tạo database
```

### Để tạo/mở Prisma Studio (dashboard quản lý), chạy:

```bash
npx prisma studio
```

### 3. Cấu hình kết nối cơ sở dữ liệu

```bash
// Cấu hình kết nối cơ sở dữ liệu trong file .env
DATABASE_URL="mysql://your-username:your-password@localhost:3306/electronic_prescription"
```

Đảm bảo MySQL đã chạy và bạn nhập đúng tài khoản, mật khẩu.

### 4. Build ứng dụng

```bash
npm run build
```

Sau khi build xong, chạy lệnh:

```bash
npm run start
```

Mở trình duyệt và truy cập vào địa chỉ: http://localhost:3000

### 5. Hỗ trợ

Nếu cần hỗ trợ, liên hệ:

📧 Email: baoan.dev@gmail.com

📞 Điện thoại: 0935 76 2014
