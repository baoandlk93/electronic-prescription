module.exports = {
    apps : [{
      name: 'nextapp',
      cwd: 'C:/dev/electronic-prescription',
      script: 'npm',
      args: 'start',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,            // Đổi port nếu cần
        HOST: '0.0.0.0'        // Để truy cập từ các máy khác trong mạng LAN
      }
      // Có thể thêm post_exit nếu muốn gửi thông báo khi crash
    }]
  }