"use client";
import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
const { Title } = Typography;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onFinish = async (values: any) => {
    setLoading(true);
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      router.replace("/dashboard");
      toast.success("Đăng ký thành công");
      setLoading(false);
    } else {
      toast.error("Đăng ký thất bại");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-[400px] h-[480px] bg-gray-50 border-2 border-gray-200">
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        Đăng ký
      </Title>
      <Form
        name="register"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ remember: true }}
      >
        {/* Ô nhập username */}
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Vui lòng nhập username!" },
            { min: 3, message: "Username phải có ít nhất 3 ký tự!" },
          ]}
        >
          <Input type="text" placeholder="Nhập username của bạn" />
        </Form.Item>
        {/* Ô nhập email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input type="email" placeholder="Nhập email của bạn" />
        </Form.Item>
        {/* Ô nhập mật khẩu */}
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            {
              pattern: passwordRegex,
              message:
                "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        {/* Ô xác nhận mật khẩu */}
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            Đăng ký
          </Button>
        </Form.Item>
        <div className="text-right">
          <Link href="/login">Đã có tài khoản? Đăng nhập</Link>
        </div>
      </Form>
    </div>
  );
};

export default Register;
