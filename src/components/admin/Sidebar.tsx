"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Package, Upload, Tag, ShoppingBag, ShoppingCart, Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
  { name: "Dashboard", icon: Home, href: "/admin/dashboard" },
  { name: "Products", icon: Package, href: "/admin/products" },
  { name: "Upload", icon: Upload, href: "/admin/upload" },
  { name: "Categories", icon: Tag, href: "/admin/categories" },
  { name: "Orders", icon: ShoppingBag, href: "/admin/orders" },
  { name: "Saved Carts", icon: ShoppingCart, href: "/admin/carts" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

  return (
    <aside className="bg-[#0d1117]/80 backdrop-blur-xl border-r border-white/10 text-white w-64 min-h-screen p-6 fixed left-0 top-0">
      <h1 className="text-xl font-semibold tracking-tight mb-10">Admin Panel</h1>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-3 px-4 py-3 rounded-lg group"
            >
              {active && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-white/10 rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}

              <Icon size={18} className="relative z-10 opacity-80" />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
