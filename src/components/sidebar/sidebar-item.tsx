import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isMenuActive } from "./utils";

export default function SidebarMenuItem({
  item,
  pathname,
  theme,
  open,
  openMenus,
  toggleMenu,
  mounted,
  onClose,
}: any) {
  const navigate = useNavigate();
  const isOpen = openMenus[item.key] || false;
  const isActive = isMenuActive(item, pathname);
  const split = pathname.split('/')
  const firstPath = '/' + split[1]

  if (item.children) {
    return (
      <div key={item.key}>
        {/* Parent */}
        <div className="flex items-center">
          {isActive && open ? (
            <div className="h-[30px] w-[5px] bg-white ml-2 mr-1 rounded-lg"></div>
          ) : (
            <div className="h-[30px] w-[5px] ml-2 mr-1"></div>
          )}
          <div
            onClick={() => toggleMenu(item.key)}
            className={`flex items-center cursor-pointer p-3 my-1 mr-2 rounded-lg text-sm w-[100%] text-white
              hover:bg-white/15 dark:hover:bg-white/10
              ${mounted && isActive ? "bg-white/20 dark:bg-white/15 font-semibold" : ""}`}
          >
            <div className={`${open && "mr-1"}`}>{item.icon}</div>
            {open && (
              <div className="flex justify-between w-full items-center">
                {item.label}
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                    }`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Children with animation */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out
            ${isOpen && open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="transition-all duration-300 ease-in-out ml-8">
            {item.children.map((child: any) => (
              <div
                key={child.key}
                onClick={() => {
                  onClose?.()
                  navigate(child.path!)
                }}
              >
                <div
                  className={`flex py-2 px-3 my-1 items-center rounded-md cursor-pointer text-xs mr-2 text-white
                    hover:bg-white/15 dark:hover:bg-white/10
                    ${mounted && pathname.startsWith(child.path) ? "bg-white/20 dark:bg-white/15 font-semibold" : ""}`}
                >
                  {child.label}
                </div>
              </div>
            )
            )}
          </div>
        </div>
      </div>
    );
  }

  // Normal item
  return (
    <div
      key={item.key}
      onClick={() => {
        onClose?.()
        navigate(item.path!)
      }}
      className="flex items-center"
    >
      {item.path === firstPath && open ? (
        <div className="h-[30px] w-[5px] bg-white ml-2 mr-1 rounded-lg"></div>
      ) : (
        <div className="h-[30px] w-[5px] ml-2 mr-1"></div>
      )}
      <div
        className={`flex p-3 my-1 items-center mr-2 w-[100%] rounded-lg cursor-pointer text-sm text-white
          hover:bg-white/15 dark:hover:bg-white/10
          ${mounted && firstPath === item.path ? "bg-white/20 dark:bg-white/15 font-semibold" : ""}`}
      >
        <div className={`${open && "mr-1"}`}>{item.icon}</div>
        {open && item.label}
      </div>
    </div>
  );
}
