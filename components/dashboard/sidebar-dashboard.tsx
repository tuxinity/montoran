"use client";

import { Button } from "@/components/ui/button";
import AuthApi from "@/lib/auth-api";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaCar, FaSignOutAlt, FaUsers, FaChartBar } from "react-icons/fa";
import { BsStack } from "react-icons/bs";
import { HiShoppingCart } from "react-icons/hi";

export const SidebarDashboard = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    AuthApi.logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="hidden md:block w-64 bg-white h-screen flex-col border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          <BsStack className="w-6 h-6 text-blue-600" />
          Dashboard
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <Link
          href="/dashboard"
          className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
            pathname === "/dashboard"
              ? "text-blue-600 bg-blue-50"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FaCar className="w-5 h-5 mr-3" />
          Cars
        </Link>

        <Link
          href="/dashboard/sales"
          className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
            pathname === "/dashboard/sales"
              ? "text-blue-600 bg-blue-50"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <HiShoppingCart className="w-5 h-5 mr-3" />
          Sales
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:text-gray-900"
        >
          <FaSignOutAlt className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};
