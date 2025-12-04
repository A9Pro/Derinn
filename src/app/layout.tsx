import { CartProvider } from "@/contexts/CartContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f8f6f4]">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}