"use client";
import "./Menu.css";
import { useViewTransition } from "@/hooks/useViewTransition";
import { workCategories } from "@/app/work/workCategories.js";
import { optimizeImageUrl } from "@/lib/media-delivery";

const Menu = () => {
  const { navigateWithTransition } = useViewTransition();

  const menuItems = [
    { label: "Home", route: "/" },
    { label: "About Us", route: "/about" },
    { label: "Projects", route: "/work" },
    { label: "Contact", route: "/contact" },
  ];

  const scrollToCategory = (key) => {
    const scrollWhenReady = () => {
      const el = document.getElementById(key);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        requestAnimationFrame(scrollWhenReady);
      }
    };
    requestAnimationFrame(scrollWhenReady);
  };

  const handleCategoryClick = (key) => (e) => {
    e.preventDefault();
    if (window.location.pathname === "/work") {
      scrollToCategory(key);
      return;
    }
    navigateWithTransition("/work", () => scrollToCategory(key));
  };

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
            <img
              src={optimizeImageUrl("/logo.png", 640)}
              alt="Plated Stories"
              decoding="async"
            />
          </span>
        </a>
      </div>

      <div className="nav-links">
        {menuItems.map((item) =>
          item.label === "Projects" ? (
            <div className="nav-item" key={item.label}>
              <a
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

              <div className="nav-dropdown">
                <div className="nav-dropdown-inner">
                  {workCategories.map((category) => (
                    <a
                      key={category.key}
                      href={`/work#${category.key}`}
                      className="nav-dropdown-link"
                      onClick={handleCategoryClick(category.key)}
                    >
                      {category.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
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
          )
        )}
      </div>
    </nav>
  );
};

export default Menu;
