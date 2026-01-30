# Hướng Dẫn Cài Đặt Next.js Tự Động Chạy Trên Windows

## 📋 Yêu Cầu Hệ Thống
- Windows 10/11
- Node.js LTS (phiên bản 18 trở lên)
- MySQL đã cài đặt và chạy
- Git (tùy chọn)

---

## 🔧 Bước 1: Kiểm Tra Node.js

Mở PowerShell hoặc Command Prompt và chạy:

```bash
node -v
npm -v
```

Nếu chưa cài Node.js, tải tại: https://nodejs.org/

---

## 📦 Bước 2: Cài Đặt Dependencies và Build Project

Mở PowerShell tại thư mục dự án `D:\dev\electronic-prescription`:

```bash
# Cài đặt các package cần thiết
npm install

# Build ứng dụng Next.js (bắt buộc trước khi chạy production)
npm run build

# Test chạy thử (sau khi chạy được thì nhấn Ctrl+C để dừng)
npm run start
```

**Lưu ý:** Sau khi build, bạn sẽ thấy thư mục `.next` được tạo ra. Đây là file build của Next.js.

---

## 🚀 Bước 3: Cài Đặt PM2

PM2 là process manager giúp chạy ứng dụng Node.js như một service trên Windows.

```bash
# Cài đặt PM2 global
npm install -g pm2

# Kiểm tra PM2 đã cài đặt
pm2 -v
```

---

## ⚙️ Bước 4: Chạy Ứng Dụng Với PM2

```bash
# Chạy ứng dụng với file config ecosystem.config.js
pm2 start ecosystem.config.js

# Xem trạng thái các ứng dụng đang chạy
pm2 status

# Xem logs real-time
pm2 logs nextapp

# Lưu danh sách ứng dụng hiện tại (quan trọng!)
pm2 save
```

**Giải thích:**
- `pm2 start ecosystem.config.js`: Khởi động app với cấu hình trong file
- `pm2 status`: Kiểm tra app có đang chạy không
- `pm2 logs`: Xem logs để debug nếu có lỗi
- `pm2 save`: Lưu trạng thái để PM2 nhớ sau khi restart máy

---

## 🔄 Bước 5: Cấu Hình Tự Động Khởi Động Khi Bật Windows

### Cách 1: Sử dụng pm2-windows-startup (Khuyên dùng)

```bash
# Cài đặt pm2-windows-startup
npm install -g pm2-windows-startup

# Cấu hình tự động khởi động
pm2-startup install

# Lưu lại cấu hình
pm2 save
```

Sau khi chạy `pm2-startup install`, bạn sẽ thấy một thông báo yêu cầu chạy lại PowerShell với quyền Administrator. Hãy làm theo hướng dẫn.

### Cách 2: Sử dụng Task Scheduler (Thay thế)

Nếu cách 1 không hoạt động, bạn có thể dùng Task Scheduler:

1. Mở **Task Scheduler** (gõ `taskschd.msc` trong Run)
2. Click **Create Task...**
3. Tab **General**:
   - Name: `NextJS - electronic-prescription`
   - ✅ Run whether user is logged on or not
   - ✅ Run with highest privileges
4. Tab **Triggers** → **New...**:
   - Begin the task: `At startup`
   - ✅ Enabled
5. Tab **Actions** → **New...**:
   - Action: `Start a program`
   - Program/script: `C:\Program Files\nodejs\npm.cmd` (hoặc đường dẫn npm của bạn)
   - Add arguments: `run start`
   - Start in: `D:\dev\electronic-prescription`
6. Tab **Conditions**: Bỏ tick các mục không cần thiết
7. Click **OK** và nhập password admin nếu được hỏi

---

## ✅ Bước 6: Kiểm Tra

### Kiểm tra ngay:
```bash
# Xem status
pm2 status

# Xem logs
pm2 logs nextapp --lines 50

# Kiểm tra ứng dụng có chạy không
# Mở trình duyệt và truy cập: http://localhost:3000
```

### Kiểm tra sau khi restart máy:
1. Khởi động lại máy tính
2. Sau khi Windows khởi động xong, mở PowerShell
3. Chạy `pm2 status` - bạn sẽ thấy ứng dụng đã tự động chạy
4. Truy cập `http://localhost:3000` để kiểm tra

---

## 🛠️ Các Lệnh PM2 Thường Dùng

```bash
# Dừng ứng dụng
pm2 stop nextapp

# Khởi động lại ứng dụng
pm2 restart nextapp

# Xóa ứng dụng khỏi PM2
pm2 delete nextapp

# Xem thông tin chi tiết
pm2 show nextapp

# Xem monitoring (CPU, Memory)
pm2 monit

# Xóa tất cả logs cũ
pm2 flush

# Reload ứng dụng (zero-downtime)
pm2 reload nextapp
```

---

## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi: "Port 3000 already in use"
```bash
# Tìm process đang dùng port 3000
netstat -ano | findstr :3000

# Hoặc đổi port trong ecosystem.config.js (ví dụ: PORT: 3001)
```

### Lỗi: "Cannot find module"
```bash
# Xóa node_modules và cài lại
rm -r node_modules
npm install
npm run build
pm2 restart nextapp
```

### Lỗi: Database connection failed
- Kiểm tra MySQL đã chạy chưa
- Kiểm tra thông tin trong file `.env` có đúng không
- Kiểm tra MySQL có cho phép kết nối từ localhost không

### PM2 không tự khởi động sau khi restart
```bash
# Chạy lại pm2-startup install với quyền Administrator
pm2-startup install
pm2 save
```

---

## 📝 Lưu Ý Quan Trọng

1. **Build lại khi có thay đổi code:**
   ```bash
   npm run build
   pm2 restart nextapp
   ```

2. **Kiểm tra logs thường xuyên:**
   ```bash
   pm2 logs nextapp
   ```

3. **Backup database định kỳ** (nếu có dữ liệu quan trọng)

4. **Firewall:** Nếu muốn truy cập từ máy khác trong mạng LAN, cần mở port 3000 trong Windows Firewall

---

## 🎉 Hoàn Thành!

Sau khi hoàn thành các bước trên, ứng dụng Next.js của bạn sẽ:
- ✅ Chạy như một service trên Windows
- ✅ Tự động khởi động khi bật máy
- ✅ Tự động restart nếu bị crash
- ✅ Có logs để theo dõi và debug

Chúc bạn thành công! 🚀
