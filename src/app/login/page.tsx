"use client";
import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const { Title } = Typography;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (response.ok) {
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("user", JSON.stringify(data));
      router.replace("/dashboard");
      toast.success("Đăng nhập thành công");
      setLoading(false);
    } else {
      toast.error("Đăng nhập thất bại");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-[400px] h-[400px] bg-gray-50 border-2 border-gray-200">
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        Đăng nhập
      </Title>
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="Email/Username"
          name="identity"
          rules={[
            { required: true, message: "Vui lòng nhập username hoặc email!" },
          ]}
        >
          <Input type="text" placeholder="Nhập username hoặc email của bạn" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            loading={loading}
          >
            Đăng nhập
          </Button>
        </Form.Item>
        {/* <div style={{ textAlign: "right" }}>
          <Link href="/register">Chưa có tài khoản? Đăng ký</Link>
        </div> */}
      </Form>
    </div>
  );
};

export default LoginForm;
