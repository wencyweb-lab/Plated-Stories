"use client";
import "./Menu.css";
import { useViewTransition } from "@/hooks/useViewTransition";

const Menu = () => {
  const { navigateWithTransition } = useViewTransition();

  const menuItems = [
    { label: "Home", route: "/" },
    { label: "About Us", route: "/studio" },
    { label: "Projects", route: "/work" },
    { label: "Contact", route: "/contact" },
  ];

  return (
    <nav>
      <div className="nav-logo">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            const currentPath = window.location.pathname;
            if (currentPath === "/") {
              return;
            }
            navigateWithTransition("/");
          }}
        >
          <span className="nav-logo-frame">
            <img src="/logo.png" alt="Plated Stories" />
          </span>
        </a>
      </div>

      <div className="nav-links">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.route}
            className="sm nav-link"
            onClick={(e) => {
              e.preventDefault();
              const currentPath = window.location.pathname;
              if (currentPath === item.route) return;
              navigateWithTransition(item.route);
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Menu;
