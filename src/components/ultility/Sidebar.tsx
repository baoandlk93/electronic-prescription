"use client";
import Link from "next/link";
import {
  AiFillMedicineBox,
  AiOutlineUser,
  AiOutlineFileText,
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineLogout,
} from "react-icons/ai";
import { CiVirus } from "react-icons/ci";
import type { MenuProps } from "antd";
import { Divider, Dropdown, Avatar } from "antd";
import { useEffect, useState } from "react";
export default function Sidebar() {
  const isLoggedIn = true;
  const [userName, setUserName] = useState("ADMIN");
  const items: MenuProps["items"] = [
    // {
    //   key: "3",
    //   label: "Cài đặt",
    //   icon: <AiOutlineSetting />,
    // },
    {
      key: "4",
      label: "Đăng xuất",
      icon: <AiOutlineLogout />,
      onClick: () => handleLogout(),
    },
  ];
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.username);
    }
  }, []);

  return (
    <nav className="max-h-screen w-64 bg-gradient-to-br from-blue-700 via-blue-400 to-white text-white px-6 py-8 shadow-lg flex flex-col">
      <div className="font-bold text-lg tracking-wider mb-10 text-white drop-shadow-sm">
        DANH MỤC
      </div>
      <SidebarLink href="/dashboard" Icon={AiOutlineHome} label="Trang chủ" />
      <SidebarLink
        href="/dashboard/prescription"
        Icon={AiOutlineFileText}
        label="Quản lý đơn thuốc"
      />
      <SidebarLink
        href="/dashboard/diagnosis"
        Icon={CiVirus}
        label="Quản lý bệnh"
      />
      <SidebarLink
        href="/dashboard/medicine"
        Icon={AiFillMedicineBox}
        label="Quản lý thuốc"
      />
      <SidebarLink
        href="/dashboard/patient"
        Icon={AiOutlineUser}
        label="Quản lý bệnh nhân"
      />
      {/* Thêm đường phân cách nếu muốn */}
      <div className="flex-1"></div>
      <Divider style={{ borderColor: "#7cb305" }} />
      <div className="mb-4">
        <Dropdown menu={{ items }} placement="topRight" arrow>
          <div className="flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-white/10 transition">
            <Avatar size={32} icon={<AiOutlineUser />} />
            <span>{isLoggedIn ? userName : "Tài khoản"}</span>
          </div>
        </Dropdown>
      </div>
    </nav>
  );
}

function SidebarLink({
  href,
  Icon,
  label,
}: {
  href: string;
  Icon: any;
  label: string;
}) {
  return (
    <Link href={href}>
      <span
        className="
        flex items-center gap-2 py-3 px-3 mb-2 rounded-lg font-medium
        transition-colors duration-200
        hover:bg-white/20 hover:text-blue-800
        "
      >
        <Icon size={22} />
        <span>{label}</span>
      </span>
    </Link>
  );
}
