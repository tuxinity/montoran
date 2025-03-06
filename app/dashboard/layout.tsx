import { SidebarDashboard } from "@/components/dashboard";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100 flex-col md:flex-row">
      <SidebarDashboard />
      <div className="flex-1 flex flex-col min-h-0">
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Car Inventory
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your car inventory and listings
            </p>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
