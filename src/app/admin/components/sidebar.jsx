"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, getUserData, getToken } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: "/icons/dashboard.svg", href: "/admin" },
    { name: "Products", icon: "/icons/products.svg", href: "/admin/products" },
    { name: "Orders", icon: "/icons/shopping-bag.svg", href: "/admin/orders" },
    { name: "Users", icon: "/icons/user.svg", href: "/admin/users" },
    { name: "Enquiry", icon: "/icons/enquiry.svg", href: "/admin/enquiry" },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Redirect anyway for better UX
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userData = getUserData();

  return (
    <div className="w-64 h-screen relative ">
      <div className="absolute inset-0 w-64 bg-white" />

      <div className="absolute top-8 text-slate-800 text-xl w-64 text-center font-medium">
        Bespoke Carat Admin
      </div>

      {/* User info */}
      {userData && (
        <div className="absolute top-16 text-slate-600 text-sm w-64 text-center">
          Welcome, {userData.first_name} {userData.last_name}
        </div>
      )}

      <div className="absolute left-4 top-26 inline-flex flex-col gap-2 w-56">
        {menuItems.map((item) => (
          <Link
            href={item.href}
            key={item.name}
            className={`self-stretch h-12 relative rounded-lg hover:bg-whitesmoke ${
              pathname === item.href ? "bg-whitesmoke" : "bg-white"
            }`}
          >
            <div className="absolute left-[12px] top-[12px] inline-flex items-center gap-3">
              <Image
                src={item.icon}
                alt={`${item.name} Icon`}
                width={20}
                height={20}
                className={pathname === item.href ? "" : "opacity-70"}
              />
              <div
                className={`text-md ${
                  pathname === item.href ? "text-slate-800" : "text-slate-500"
                }`}
              >
                {item.name}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="absolute left-4 bottom-4 inline-flex flex-col gap-2 w-56">
        <Link
          href="/admin/settings"
          key="settings"
          className={`self-stretch h-12 relative rounded-lg hover:bg-whitesmoke ${
            pathname === "/admin/settings" ? "bg-whitesmoke" : "bg-white"
          }`}
        >
          <div className="absolute left-[12px] top-[12px] inline-flex items-center gap-3">
            <Image
              src="/icons/setting.svg"
              alt={`Settings Icon`}
              width={20}
              height={20}
              className={pathname === "/admin/settings" ? "" : "opacity-70"}
            />
            <div
              className={`text-md ${
                pathname === "/admin/settings"
                  ? "text-slate-800"
                  : "text-slate-500"
              }`}
            >
              Settings
            </div>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer self-stretch h-12 relative rounded-lg hover:bg-red-50 bg-white w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute left-[12px] top-[12px] inline-flex items-center gap-3">
            {isLoggingOut ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-500"></div>
            ) : (
              <Image
                src="/icons/logout.svg"
                alt="Logout Icon"
                width={20}
                height={20}
                className="opacity-70"
              />
            )}
            <div className="text-md text-slate-500">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
