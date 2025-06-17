import Link from "next/link";
import {
  AiFillMedicineBox,
  AiOutlineUser,
  AiOutlineFileText,
  AiOutlineBarChart,
} from "react-icons/ai";

export default function Sidebar() {
  return (
    <nav className="min-h-screen w-64 bg-gradient-to-br from-blue-700 via-blue-400 to-white text-white px-6 py-8 shadow-lg flex flex-col">
      <div className="font-bold text-lg tracking-wider mb-10 text-white drop-shadow-sm">
        DANH MỤC
      </div>
      <SidebarLink
        href="/prescription"
        Icon={AiOutlineFileText}
        label="Quản lý đơn thuốc"
      />
      <SidebarLink
        href="/medicine"
        Icon={AiFillMedicineBox}
        label="Quản lý thuốc"
      />
      <SidebarLink
        href="/patient"
        Icon={AiOutlineUser}
        label="Quản lý bệnh nhân"
      />
      <SidebarLink
        href="/statistics"
        Icon={AiOutlineBarChart}
        label="Thống kê"
      />
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
