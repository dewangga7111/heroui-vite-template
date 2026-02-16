
export default function Footer() {
  const year = new Date().getFullYear();
  const appName = import.meta.env.VITE_WEB_TITLE || "HeroUI Admin";

  return (
    <footer className="text-center py-3 border-t border-default-100 text-sm text-default-500 ">
      © {year} {appName}. All rights reserved.
    </footer>
  );
}
