import FloatingNav from "@/components/FloatingNav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FloatingNav />
      {children}
    </>
  );
}