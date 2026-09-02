"use client";
import "./work.css";
import { useRef, useMemo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useViewTransition } from "@/hooks/useViewTransition";
import Copy from "@/components/Copy/Copy";
import { workCategories } from "./workCategories.js";

gsap.registerPlugin(useGSAP);

const Page = () => {
  const { navigateWithTransition, router } = useViewTransition();

  const workPageContainer = useRef(null);

  // Projects keep a running number and variant colour across the whole page, so
  // the index reads 01 -> 13 and no two neighbouring folders share a colour.
  // Each category is then chunked into rows of two, the same pairing the
  // folder stack has always used.
  const categories = useMemo(() => {
    let count = 0;

    return workCategories.map((category) => {
      const projects = category.projects.map((project) => {
        const position = count++;

        return {
          ...project,
          index: String(position + 1).padStart(2, "0"),
          variant: `variant-${(position % 3) + 1}`,
        };
      });

      const rows = [];
      for (let i = 0; i < projects.length; i += 2) {
        rows.push(projects.slice(i, i + 2));
      }

      return { ...category, rows };
    });
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(workPageContainer);
      const folders = q(".folder");
      const folderWrappers = q(".folder-wrapper");

      let isMobile = window.innerWidth < 1000;

      const setInitialPositions = () => {
        gsap.set(folderWrappers, { y: isMobile ? 0 : 25 });
      };

      const mouseEnterHandlers = new Map();
      const mouseLeaveHandlers = new Map();

      folders.forEach((folder, index) => {
        const previewImages = folder.querySelectorAll(".folder-preview-img");

        const onEnter = () => {
          if (isMobile) return;

          folders.forEach((siblingFolder) => {
            if (siblingFolder !== folder) {
              siblingFolder.classList.add("disabled");
            }
          });

          gsap.to(folderWrappers[index], {
            y: 0,
            duration: 0.25,
            ease: "back.out(1.7)",
          });

          previewImages.forEach((img, imgIndex) => {
            let rotation;
            if (imgIndex === 0) {
              rotation = gsap.utils.random(-20, -10);
            } else if (imgIndex === 1) {
              rotation = gsap.utils.random(-10, 10);
            } else {
              rotation = gsap.utils.random(10, 20);
            }

            gsap.to(img, {
              y: "-100%",
              rotation,
              duration: 0.25,
              ease: "back.out(1.7)",
              delay: imgIndex * 0.025,
            });
          });
        };

        const onLeave = () => {
          if (isMobile) return;

          folders.forEach((siblingFolder) => {
            siblingFolder.classList.remove("disabled");
          });

          gsap.to(folderWrappers[index], {
            y: 25,
            duration: 0.25,
            ease: "back.out(1.7)",
          });

          previewImages.forEach((img, imgIndex) => {
            gsap.to(img, {
              y: "0%",
              rotation: 0,
              duration: 0.25,
              ease: "back.out(1.7)",
              delay: imgIndex * 0.05,
            });
          });
        };

        mouseEnterHandlers.set(folder, onEnter);
        mouseLeaveHandlers.set(folder, onLeave);
        folder.addEventListener("mouseenter", onEnter);
        folder.addEventListener("mouseleave", onLeave);
      });

      const handleResize = () => {
        const currentBreakpoint = window.innerWidth < 1000;
        if (currentBreakpoint !== isMobile) {
          isMobile = currentBreakpoint;
          setInitialPositions();

          folders.forEach((folder) => {
            folder.classList.remove("disabled");
          });
          const allPreviewImages = q(".folder-preview-img");
          gsap.set(allPreviewImages, { y: "0%", rotation: 0 });
        }
      };

      window.addEventListener("resize", handleResize);
      setInitialPositions();

      return () => {
        window.removeEventListener("resize", handleResize);
        folders.forEach((folder) => {
          const onEnter = mouseEnterHandlers.get(folder);
          const onLeave = mouseLeaveHandlers.get(folder);
          if (onEnter) folder.removeEventListener("mouseenter", onEnter);
          if (onLeave) folder.removeEventListener("mouseleave", onLeave);
        });
      };
    },
    { scope: workPageContainer }
  );

  return (
    <div className="work-page" ref={workPageContainer}>
      {categories.map((category) => (
        <section className="work-category" id={category.key} key={category.key}>
          <div className="work-category-header">
            <Copy animateOnScroll={true}>
              <h2>{category.title}</h2>
            </Copy>
            <p className="sm">
              ({String(category.projects.length).padStart(2, "0")}{" "}
              {category.projects.length === 1 ? "Project" : "Projects"})
            </p>
          </div>

          <div className="folders">
            {category.rows.map((row, rowIndex) => (
              <div className="row" key={`${category.key}-row-${rowIndex}`}>
                {row.map((item) => (
                  <a
                    key={item.index}
                    href={item.href}
                    onMouseEnter={() => router.prefetch(item.href)}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateWithTransition(item.href);
                    }}
                  >
                    <div className={`folder ${item.variant}`}>
                      <div className="folder-preview">
                        {item.images.map((src, i) => (
                          <div
                            className="folder-preview-img"
                            key={`${item.index}-img-${i}`}
                          >
                            <img src={src} alt={`${item.name} preview ${i + 1}`} />
                          </div>
                        ))}
                      </div>
                      <div className="folder-wrapper">
                        <div className="folder-index">
                          <p>{item.index}</p>
                        </div>
                        <div className="folder-name">
                          <h1>{item.name}</h1>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Page;
