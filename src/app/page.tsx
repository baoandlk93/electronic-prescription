"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  // Giả sử bạn kiểm tra login qua localStorage hoặc context
  // Ví dụ: lấy token lưu ở localStorage
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login"); // Redirect sang trang đăng nhập
    } else {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, router]);

  // Nếu chưa login thì không render trang chủ
  if (isLoggedIn) return null;

  return <div>{/* Nội dung khác */}</div>;
}
