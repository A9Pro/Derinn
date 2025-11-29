"use client";
import { useEffect, useState } from "react";
import { Home, ShoppingCart, Tag, Info, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState("home");

  const desktopLinks = [
    { name: "Home", href: "/", id: "home" },
    { name: "Shop", href: "/shop", id: "shop" },
    { name: "Categories", href: "/categories", id: "categories" },
    { name: "About", href: "/about", id: "about" },
    { name: "Contact", href: "/contact", id: "contact" },
  ];

  const mobileLinks = [
    { icon: <Home size={24} />, href: "/", id: "home" },
    { icon: <Tag size={24} />, href: "/shop", id: "shop" },
    { icon: <ShoppingCart size={24} />, href: "/categories", id: "categories" },
    { icon: <Info size={24} />, href: "/about", id: "about" },
    { icon: <Phone size={24} />, href: "/contact", id: "contact" },
  ];

  const logos = [
    "/logos/logo1.png",
    "/logos/logo2.png",
    "/logos/logo3.png",
  ];
  const [logo, setLogo] = useState("");

  useEffect(() => {
    setLogo(logos[Math.floor(Math.random() * logos.length)]);
  }, []);

  return (
    <>
      {/* Desktop Nav */}
      <nav className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 flex-col items-start z-50 space-y-6">

        {/* Random Logo */}
        <motion.img
          src={logo}
          className="w-16 h-auto opacity-90"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        />

        {/* Links */}
        <ul className="flex flex-col gap-4 mt-6">
          {desktopLinks.map((link) => (
            <motion.li
              key={link.name}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.4 }}
            >
              <a
                href={link.href}
                className={`uppercase tracking-wide text-sm transition ${
                  activeSection === link.id
                    ? "text-black font-bold"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {link.name}
              </a>
            </motion.li>
          ))}
        </ul>

        <ShoppingCart size={26} className="text-black mt-8" />
      </nav>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 flex justify-around w-[90%] bg-white/20 backdrop-blur-xl p-3 rounded-full shadow-lg z-50">
        {mobileLinks.map((link, idx) => (
          <motion.a
            key={idx}
            href={link.href}
            whileHover={{ scale: 1.1 }}
            className="text-gray-700"
          >
            {link.icon}
          </motion.a>
        ))}
      </nav>
    </>
  );
}
