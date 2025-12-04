"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Tag, Info, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingNav() {
  const pathname = usePathname();

  // Hide nav on admin pages
  if (pathname.startsWith("/admin")) return null;

  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count
  useEffect(() => {
    async function loadCartCount() {
      try {
        const res = await fetch("/api/cart/count", { cache: "no-store" });
        const data = await res.json();
        setCartCount(data.count || 0);
      } catch (err) {
        console.error("Cart count error:", err);
      }
    }
    loadCartCount();

    // Poll every 15s in case user adds items on another component
    const interval = setInterval(loadCartCount, 15000);
    return () => clearInterval(interval);
  }, []);

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
    { icon: <ShoppingCart size={24} />, href: "/cart", id: "cart" },
    { icon: <Info size={24} />, href: "/about", id: "about" },
    { icon: <Phone size={24} />, href: "/contact", id: "contact" },
  ];

  const logos = ["/logos/logo1.png", "/logos/logo2.png", "/logos/logo3.png"];
  const [logoIndex, setLogoIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");
  const lastScrollY = useRef(0);

  // Logo auto-rotate
  useEffect(() => {
    const interval = setInterval(
      () => setLogoIndex((prev) => (prev + 1) % logos.length),
      10000
    );
    return () => clearInterval(interval);
  }, []);

  // Scroll + active section logic
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollDir(currentY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentY;

      let currentSection = "home";
      const sections = desktopLinks.map((link) =>
        document.getElementById(link.id)
      );
      sections.forEach((sec) => {
        if (sec && window.scrollY + 100 >= sec.offsetTop) {
          currentSection = sec.id;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Magnetic hover
  const handleMouseMove = (e: React.MouseEvent, ref: HTMLAnchorElement) => {
    const rect = ref.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 4;
    const y = (e.clientY - rect.top - rect.height / 2) / 4;
    ref.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = (ref: HTMLAnchorElement) => {
    ref.style.transform = "translate(0px,0px)";
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 flex-col items-start z-50 space-y-6 transition-transform duration-300 ${
          scrollDir === "down"
            ? "-translate-x-20 opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        {/* Logo */}
        <div className="w-16 h-16 relative drop-shadow-lg">
          <AnimatePresence mode="wait">
            <motion.img
              key={logos[logoIndex]}
              src={logos[logoIndex]}
              className="absolute w-16 h-auto top-0 left-0 mix-blend-screen"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.6 }}
            />
          </AnimatePresence>
        </div>

        {/* Links */}
        <ul className="flex flex-col gap-4 mt-6">
          {desktopLinks.map((link) => (
            <motion.li
              key={link.name}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.35 }}
            >
              <a
                href={link.href}
                id={link.id}
                ref={(el) => {
                  if (el) {
                    el.onmousemove = (e) => handleMouseMove(e as any, el);
                    el.onmouseleave = () => handleMouseLeave(el);
                  }
                }}
                className={`uppercase tracking-wide text-sm font-bold transition-colors duration-200 ${
                  activeSection === link.id
                    ? "text-[#3B5F36]"
                    : "text-[#1C3B1C] hover:text-[#6BAF6B]"
                }`}
              >
                {link.name}
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Floating Cart with Count */}
        <a href="/cart" className="relative mt-8">
          <ShoppingCart
            size={30}
            className="text-[#1C3B1C] drop-shadow-md hover:scale-110 transition-transform duration-200"
          />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#3B5F36] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </a>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 flex justify-around w-[90%] bg-white/20 backdrop-blur-xl p-3 rounded-full shadow-lg z-50">
        {mobileLinks.map((link, idx) => (
          <motion.a
            key={idx}
            href={link.href}
            whileHover={{ scale: 1.2 }}
            className="relative text-[#1C3B1C]"
          >
            {link.icon}
            {link.id === "cart" && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#3B5F36] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </motion.a>
        ))}
      </nav>
    </>
  );
}
