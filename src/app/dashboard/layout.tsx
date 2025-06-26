import Sidebar from "@/components/ultility/Sidebar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
