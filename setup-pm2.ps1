# Script tự động cài đặt PM2 và cấu hình tự khởi động cho Next.js trên Windows
# Chạy script này với quyền Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cài Đặt PM2 cho Next.js Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra quyền Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  CẢNH BÁO: Script này cần chạy với quyền Administrator!" -ForegroundColor Yellow
    Write-Host "   Vui lòng mở PowerShell với quyền Administrator và chạy lại." -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

# Bước 1: Kiểm tra Node.js
Write-Host "[1/6] Kiểm tra Node.js..." -ForegroundColor Green
try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    Write-Host "   ✓ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "   ✓ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Node.js chưa được cài đặt!" -ForegroundColor Red
    Write-Host "   Vui lòng cài đặt Node.js từ https://nodejs.org/" -ForegroundColor Red
    pause
    exit
}

# Bước 2: Kiểm tra PM2
Write-Host ""
Write-Host "[2/6] Kiểm tra PM2..." -ForegroundColor Green
$pm2Installed = $false
try {
    $pm2Version = pm2 -v
    Write-Host "   ✓ PM2 đã được cài đặt: $pm2Version" -ForegroundColor Green
    $pm2Installed = $true
} catch {
    Write-Host "   ⚠ PM2 chưa được cài đặt, đang cài đặt..." -ForegroundColor Yellow
    npm install -g pm2
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ PM2 đã được cài đặt thành công!" -ForegroundColor Green
        $pm2Installed = $true
    } else {
        Write-Host "   ✗ Không thể cài đặt PM2!" -ForegroundColor Red
        pause
        exit
    }
}

# Bước 3: Kiểm tra pm2-windows-startup
Write-Host ""
Write-Host "[3/6] Kiểm tra pm2-windows-startup..." -ForegroundColor Green
$pm2StartupInstalled = $false
try {
    pm2-startup -h | Out-Null
    Write-Host "   ✓ pm2-windows-startup đã được cài đặt" -ForegroundColor Green
    $pm2StartupInstalled = $true
} catch {
    Write-Host "   ⚠ pm2-windows-startup chưa được cài đặt, đang cài đặt..." -ForegroundColor Yellow
    npm install -g pm2-windows-startup
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ pm2-windows-startup đã được cài đặt thành công!" -ForegroundColor Green
        $pm2StartupInstalled = $true
    } else {
        Write-Host "   ✗ Không thể cài đặt pm2-windows-startup!" -ForegroundColor Red
    }
}

# Bước 4: Kiểm tra build
Write-Host ""
Write-Host "[4/6] Kiểm tra build của ứng dụng..." -ForegroundColor Green
if (Test-Path ".next") {
    Write-Host "   ✓ Ứng dụng đã được build (.next folder tồn tại)" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Ứng dụng chưa được build!" -ForegroundColor Yellow
    $build = Read-Host "   Bạn có muốn build ngay bây giờ? (y/n)"
    if ($build -eq "y" -or $build -eq "Y") {
        Write-Host "   Đang build ứng dụng..." -ForegroundColor Yellow
        npm run build
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✓ Build thành công!" -ForegroundColor Green
        } else {
            Write-Host "   ✗ Build thất bại!" -ForegroundColor Red
            pause
            exit
        }
    } else {
        Write-Host "   ⚠ Vui lòng chạy 'npm run build' trước khi tiếp tục!" -ForegroundColor Yellow
    }
}

# Bước 5: Tạo thư mục logs nếu chưa có
Write-Host ""
Write-Host "[5/6] Kiểm tra thư mục logs..." -ForegroundColor Green
if (-not (Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
    Write-Host "   ✓ Đã tạo thư mục logs" -ForegroundColor Green
} else {
    Write-Host "   ✓ Thư mục logs đã tồn tại" -ForegroundColor Green
}

# Bước 6: Cấu hình PM2
Write-Host ""
Write-Host "[6/6] Cấu hình PM2..." -ForegroundColor Green

# Dừng app cũ nếu đang chạy
Write-Host "   Đang dừng ứng dụng cũ (nếu có)..." -ForegroundColor Yellow
pm2 delete nextapp 2>$null | Out-Null

# Khởi động app với config
Write-Host "   Đang khởi động ứng dụng với PM2..." -ForegroundColor Yellow
pm2 start ecosystem.config.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Ứng dụng đã được khởi động!" -ForegroundColor Green
    
    # Lưu cấu hình PM2
    Write-Host "   Đang lưu cấu hình PM2..." -ForegroundColor Yellow
    pm2 save
    
    # Cấu hình tự khởi động
    if ($pm2StartupInstalled) {
        Write-Host "   Đang cấu hình tự khởi động..." -ForegroundColor Yellow
        pm2-startup install
        pm2 save
        Write-Host "   ✓ Đã cấu hình tự khởi động!" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  ✓ CÀI ĐẶT THÀNH CÔNG!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Ứng dụng đang chạy tại: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Các lệnh hữu ích:" -ForegroundColor Yellow
    Write-Host "  pm2 status          - Xem trạng thái" -ForegroundColor White
    Write-Host "  pm2 logs nextapp    - Xem logs" -ForegroundColor White
    Write-Host "  pm2 restart nextapp - Khởi động lại" -ForegroundColor White
    Write-Host "  pm2 stop nextapp    - Dừng ứng dụng" -ForegroundColor White
    Write-Host ""
    
    # Hiển thị status
    pm2 status
    
} else {
    Write-Host "   ✗ Không thể khởi động ứng dụng!" -ForegroundColor Red
    Write-Host "   Vui lòng kiểm tra lại cấu hình trong ecosystem.config.js" -ForegroundColor Yellow
}

Write-Host ""
pause
