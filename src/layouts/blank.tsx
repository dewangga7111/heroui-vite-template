import { Outlet } from "react-router-dom";

export default function BlankLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-stone-50 via-primary-100 to-stone-50 dark:bg-black dark:bg-none">
      <Outlet />
    </div>
  );
}
