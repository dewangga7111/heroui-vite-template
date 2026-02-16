import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar/sidebar";
import { Navbar } from "@/components/navbar";
import { Suspense, useEffect, useState } from "react";
import Footer from "@/components/footer";

const Loading = () => <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

export default function DashboardLayout() {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-stone-50 via-primary-100 to-stone-50 dark:bg-black dark:bg-none">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1">
        <div className="sticky top-0 z-50 mx-3">
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        <main className="flex-grow px-3 py-3 overflow-y-auto 3xl:max-w-7xl 3xl:mx-auto 3xl:w-full">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}
