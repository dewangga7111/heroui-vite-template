import { Outlet } from "react-router-dom";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout() {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        <Outlet />
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <a
          className="flex items-center gap-1 text-current"
          href="https://heroui.com"
          target="_blank"
          rel="noopener noreferrer"
          title="heroui.com homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">HeroUI</p>
        </a>
      </footer>
    </div>
  );
}
