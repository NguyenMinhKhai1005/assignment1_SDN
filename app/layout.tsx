"use client";
// app/layout.tsx
import "./globals.css";
import { SearchProvider } from "@/context/SearchContext";

import { SessionProvider } from "next-auth/react";

// Component NavBar là client component

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";


function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg p-5 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <ShoppingBag className="h-9 w-9 text-white" />
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Clothing Store
        </h2>
      </div>
      <div className="flex items-center gap-8">
        <Link href="/">
          <p className="text-white text-lg font-medium hover:text-yellow-300 transition-colors duration-300">
            Trang chủ
          </p>
        </Link>
        {session ? (
          <>
            <Link href="/products/create">
              <p className="text-white text-lg font-medium hover:text-yellow-300 transition-colors duration-300">
                Tạo sản phẩm
              </p>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-white text-lg font-medium hover:text-yellow-300 transition-colors duration-300"
            >
              Đăng Xuất
            </button>
          </>
        ) : (
          <>
            <Link href="/register">
              <p className="text-white text-lg font-medium hover:text-yellow-300 transition-colors duration-300">
                Đăng Ký
              </p>
            </Link>
            <button
              onClick={() => signIn()}
              className="text-white text-lg font-medium hover:text-yellow-300 transition-colors duration-300"
            >
              Đăng Nhập
            </button>
          </>
        )}
        <div className="ml-4 w-72">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full px-5 py-2 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-inner transition duration-200"
          />
      </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          <SearchProvider> {/* Đảm bảo SearchProvider bao bọc toàn bộ */}
            <NavBar />
            {children}
          </SearchProvider>
        </SessionProvider>
      </body>
    </html>
  );
}