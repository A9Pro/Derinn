import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      {/* Add left margin to account for fixed sidebar width (w-64 = 256px) */}
      <main className="flex-1 ml-64 p-8 bg-[#0e0e0e] text-white min-h-screen">
        {children}
      </main>
    </div>
  );
}