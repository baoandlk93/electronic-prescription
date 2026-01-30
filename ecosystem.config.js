module.exports = {
  apps: [{
    name: 'nextapp',
    cwd: 'D:/dev/electronic-prescription',
    script: 'npm',
    args: 'start',
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0',
      // Biến môi trường từ file .env
      DATABASE_URL: 'mysql://root:12345678@localhost:3306/electronic_prescription',
      NEXT_PUBLIC_API_PROVINCE_URL: 'https://provinces.open-api.vn/api/v2/'
    },
    // Tự động restart khi crash
    autorestart: true,
    // Số lần restart tối đa trong 10 giây
    max_restarts: 10,
    min_uptime: '10s',
    // Log files
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};