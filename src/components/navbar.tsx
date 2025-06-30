import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const IconDict = {
  home: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 256 256"
    >
      <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z" />
    </svg>
  ),
  homeFilled: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 256 256"
    >
      <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,.61.61,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
    </svg>
  ),
  plus: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 256 256"
    >
      <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
    </svg>
  ),
  plusFilled: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 256 256"
    >
      <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM168,136H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z" />
    </svg>
  ),
  gift: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M22 12h-6a2 2 0 0 0 0 4h6" />
      <path d="M12 1v6m0 0l-3-3m3 3l3-3" />
    </svg>
  ),
  giftFilled: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M22 12h-6a2 2 0 0 0 0 4h6" fill="white" />
      <path
        d="M12 1v6"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 4l3 3 3-3"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  user: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 256 256"
    >
      <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
    </svg>
  ),
  userFilled: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 256 256"
    >
      <path d="M128,144a64,64,0,1,0-64-64A64.07,64.07,0,0,0,128,144Zm0,16c-43.07,0-80.61,23.94-100.7,62.43a8,8,0,0,0,14.18,7.14C58.82,191.52,91.67,168,128,168s69.18,23.52,86.52,61.57a8,8,0,0,0,14.18-7.14C208.61,183.94,171.07,160,128,160Z" />
    </svg>
  ),
};

const navItems = [
  {
    id: "home",
    label: "home" as const,
    path: "/",
    icon: "home" as const,
    filledIcon: "homeFilled" as const,
  },
  {
    id: "games",
    label: "games" as const,
    path: "/games",
    icon: "plus" as const,
    filledIcon: "plusFilled" as const,
  },
  {
    id: "replenish",
    label: "replenish" as const,
    path: "/replenish",
    icon: "gift" as const,
    filledIcon: "giftFilled" as const,
  },
  {
    id: "profile",
    label: "profile" as const,
    path: "/profile",
    icon: "user" as const,
    filledIcon: "userFilled" as const,
  },
];


const colors = {
  active: "#181811",
  inactive: "#8c8b5f",
  background: "#ffffff",
  border: "#f5f5f0",
};

interface NavbarItemProps {
  item: {
    id: string;
    label: string;
    path: string;
    icon: keyof typeof IconDict;
    filledIcon: keyof typeof IconDict;
  };
  isActive: boolean;
}
const NavbarItem = ({ item, isActive }: NavbarItemProps) => {
  const iconToRender = isActive ? item.filledIcon : item.icon;
  const { t } = useTranslation();

  return (
    <Link
      to={item.path}
      className={`flex flex-1 flex-col items-center justify-end gap-1 transition-colors duration-200 ${
        isActive ? `text-[${colors.active}]` : `text-[${colors.inactive}]`
      }`}
    >
      <div
        className={`flex h-8 items-center justify-center transition-colors duration-200 ${
          isActive ? `text-[${colors.active}]` : `text-[${colors.inactive}]`
        }`}
      >
        {IconDict[iconToRender]}
      </div>
      <p
        className={`text-xs font-medium leading-normal tracking-[0.015em] transition-colors duration-200 ${
          isActive ? `text-[${colors.active}]` : `text-[${colors.inactive}]`
        }`}
      >
        {t(`navbar.${item.label}`)}
      </p>
    </Link>
  );
};

const Navbar = () => {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <section>
      <div className="fixed bottom-0 w-full z-50">
        <div
          className={`flex gap-2 border-t px-4 pb-3 pt-2 backdrop-blur-sm`}
          style={{
            borderColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          {navItems.map((item) => (
            <NavbarItem
              key={item.id}
              item={item}
              isActive={isActiveRoute(item.path)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Navbar;
