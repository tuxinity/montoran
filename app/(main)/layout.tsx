import NavbarLayout from "@/components/layout/navbar-layout";
import FooterLayout from "@/components/layout/footer-layout";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavbarLayout />
      <main className="flex-1">{children}</main>
      <FooterLayout />
    </>
  );
};

export default MainLayout;
