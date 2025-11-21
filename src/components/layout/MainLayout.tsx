import Navbar from "./Navbar";
import Footer from "./Footer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="fixed inset-0 bg-cyber-grid opacity-10 pointer-events-none"></div>
      <Navbar />
      <main className="grow relative z-10">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
