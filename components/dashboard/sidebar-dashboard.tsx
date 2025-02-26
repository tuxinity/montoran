import { Button } from "@/components/ui/button";
import { logout } from "@/lib/car-api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SidebarDashboard = () => {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
    router.refresh();
  };
  return (
    <div className="hidden md:block w-64 bg-white h-screen flex-col border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          <svg
            className="w-6 h-6 text-blue-600"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Dashboard
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <Link
          href="/dashboard"
          className="flex items-center px-3 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg"
        >
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Cars
        </Link>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:text-gray-900"
        >
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </Button>
      </div>
    </div>
  );
};
