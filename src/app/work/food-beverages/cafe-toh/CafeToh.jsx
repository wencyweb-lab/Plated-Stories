"use client";
import "./cafe-toh.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuArrowLeft, LuArrowRight, LuX } from "react-icons/lu";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "@/components/Footer/Footer";
import Copy from "@/components/Copy/Copy";
import Button from "@/components/Button/Button";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Body copy lives in plain string constants rather than inline JSX text:
// GSAP's SplitText rebuilds the text nodes it splits and trims each one's
// leading whitespace, so a sentence broken across `{expr}` boundaries loses
// the spaces around them. One text node, one string.
const EM = "—";
const RSQUO = "’";

const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src);

const META = [
  { label: "Client", value: "Cafe Toh" },
  { label: "Category", value: "Food & Beverages" },
  { label: "Services", value: "Strategy, Production, Editing" },
];

// Four parts, each with its own rack of frames you drag through. A part
// with no media yet is skipped, so filling one in later is a one-line
// change here and nothing else.
const SECTIONS = [
  {
    number: "01",
    name: "Art vs Artist",
    copy: `The room and the people who make it ${EM} work on the walls set against the hands that plate, pour and serve.`,
    media: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788380469/vewcbj.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788380469/hebdcks.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788380468/vehbkj.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788380468/wiuer.png",
    ],
  },
  {
    number: "02",
    name: "Dishes That Keep Calling Back",
    copy: `The orders regulars don${RSQUO}t need the menu for, shot to earn the second visit.`,
    media: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788381159/cghbjh.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788381159/xfgcfhgh.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788381158/fgchvbh.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788381158/srdgfh.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788381158/tcfvghbj.png",
    ],
  },
  // Awaiting media — each part appears the moment its links land.
  {
    number: "03",
    name: "Textures",
    copy: `Close enough to feel it ${EM} crumb, foam, grain and glaze at a distance no diner gets.`,
    media: [],
  },
  {
    number: "04",
    name: "Vinyls",
    copy: `The other half of the room, and the reason people stay for a second cup.`,
    media: [],
  },
];

// The opening frames, borrowed for the hero strip. One per section first,
// so the strip previews the whole study rather than just its first part.
const HERO_FRAMES = [
  ...SECTIONS.flatMap((item) => item.media.slice(0, 1)),
  ...SECTIONS.flatMap((item) => item.media.slice(1)),
].slice(0, 5);

const OUTCOMES = [
  { title: "Deliverables", value: "Content Strategy, Reels & Carousels" },
  { title: "Community", value: "Highly Engaged & Loyal" },
  { title: "Brand Impact", value: "Stronger Recognition & Recall" },
];

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

// A single frame in a rack. Reels loop muted here; sound lives in the
// lightbox, where the visitor has actually asked for the thing.
const Frame = ({ src, label, onOpen }) => (
  <button type="button" className="toh-frame" onClick={onOpen}>
    {isVideo(src) ? (
      <video src={src} autoPlay muted loop playsInline preload="metadata" />
    ) : (
      <img src={src} alt={label} loading="lazy" />
    )}
    <span className="toh-frame-cue sm">View</span>
  </button>
);

// How long a frame holds before the rack auto-advances to the next one.
const AUTOPLAY_MS = 3200;

// A horizontal rack you drag, throw or arrow through. Native overflow does
// the scrolling, so trackpads, wheels and touch all keep working; the
// pointer handlers only add drag on top of it. Left alone, it also drifts
// itself one frame at a time and loops back once it runs out of rail.
const Rack = ({ items, name, onOpen }) => {
  const railRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 });
  const paused = useRef(false);
  const autoplayId = useRef(null);

  const readProgress = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setProgress(max > 0 ? rail.scrollLeft / max : 1);
  }, []);

  useEffect(() => {
    readProgress();
    window.addEventListener("resize", readProgress);
    return () => window.removeEventListener("resize", readProgress);
  }, [readProgress, items]);

  const step = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    const tile = rail.querySelector(".toh-frame");
    const by = tile ? tile.offsetWidth + 24 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: by * direction, behavior: "smooth" });
  };

  // Idles forward on its own so a rack nobody touches still tells its story;
  // any real interaction (drag, hover, keyboard) pauses it for good until
  // the visitor moves on.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    autoplayId.current = setInterval(() => {
      const rail = railRef.current;
      if (!rail || paused.current) return;

      const max = rail.scrollWidth - rail.clientWidth;
      if (max <= 0) return;

      if (rail.scrollLeft >= max - 4) {
        rail.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        step(1);
      }
    }, AUTOPLAY_MS);

    return () => clearInterval(autoplayId.current);
  }, [items]);

  const pauseAutoplay = () => {
    paused.current = true;
  };

  const onPointerDown = (e) => {
    pauseAutoplay();
    const rail = railRef.current;
    if (!rail || e.pointerType === "touch") return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startLeft: rail.scrollLeft,
      moved: 0,
    };
    rail.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const rail = railRef.current;
    if (!rail || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.abs(dx);
    rail.scrollLeft = drag.current.startLeft - dx;
  };

  const endDrag = (e) => {
    const rail = railRef.current;
    if (!rail || !drag.current.active) return;
    drag.current.active = false;
    if (rail.hasPointerCapture?.(e.pointerId)) {
      rail.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="toh-rack">
      <div
        className="toh-rail"
        ref={railRef}
        onScroll={readProgress}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={pauseAutoplay}
      >
        {items.map((src, i) => (
          <Frame
            key={src}
            src={src}
            label={`${name} ${i + 1}`}
            // A drag that travelled is a drag, not a click on a tile.
            onOpen={() => {
              if (drag.current.moved > 6) return;
              onOpen(i);
            }}
          />
        ))}
      </div>

      <div className="toh-rack-foot">
        <div className="toh-scrub" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.max(progress, 0.06)})` }} />
        </div>

        <div className="toh-controls">
          <p className="sm toh-hint">Drag</p>
          <button
            type="button"
            className="toh-round"
            onClick={() => {
              pauseAutoplay();
              step(-1);
            }}
            aria-label={`Previous frame in ${name}`}
          >
            <LuArrowLeft size={16} />
          </button>
          <button
            type="button"
            className="toh-round"
            onClick={() => {
              pauseAutoplay();
              step(1);
            }}
            aria-label={`Next frame in ${name}`}
          >
            <LuArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Full-frame viewer. Reels get real controls here; arrows and Escape work
// the way anyone would expect them to.
const Lightbox = ({ open, items, index, name, onClose, onStep }) => {
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, onStep]);

  if (!open) return null;

  const src = items[index];

  return (
    <div className="toh-lightbox" role="dialog" aria-modal="true">
      <div className="toh-lightbox-bg" onClick={onClose} />

      <div className="toh-lightbox-stage">
        {isVideo(src) ? (
          <video src={src} autoPlay loop playsInline controls />
        ) : (
          <img src={src} alt={`${name} ${index + 1}`} />
        )}
      </div>

      <div className="toh-lightbox-bar container">
        <p className="sm">{`${name} / ${String(index + 1).padStart(
          2,
          "0"
        )} of ${String(items.length).padStart(2, "0")}`}</p>

        <div className="toh-controls">
          <button
            type="button"
            className="toh-round"
            onClick={() => onStep(-1)}
            aria-label="Previous"
          >
            <LuArrowLeft size={16} />
          </button>
          <button
            type="button"
            className="toh-round"
            onClick={() => onStep(1)}
            aria-label="Next"
          >
            <LuArrowRight size={16} />
          </button>
          <button
            type="button"
            className="toh-round"
            onClick={onClose}
            aria-label="Close"
          >
            <LuX size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CafeToh = ({ name, next }) => {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const [active, setActive] = useState(0);
  const [viewer, setViewer] = useState({ open: false, section: 0, index: 0 });

  const sections = SECTIONS.filter((item) => item.media.length > 0);

  const openViewer = (sectionIndex, index) =>
    setViewer({ open: true, section: sectionIndex, index });

  const stepViewer = useCallback(
    (direction) => {
      setViewer((current) => {
        const items = sections[current.section]?.media ?? [];
        if (!items.length) return current;
        const nextIndex =
          (current.index + direction + items.length) % items.length;
        return { ...current, index: nextIndex };
      });
    },
    [sections]
  );

  const closeViewer = useCallback(
    () => setViewer((current) => ({ ...current, open: false })),
    []
  );

  // The hero strip: tiles rise on load, drift as the hero scrolls away, and
  // lean a little towards the cursor so the row has some give to it.
  useGSAP(
    () => {
      const hero = heroRef.current;
      const tiles = gsap.utils.toArray(".toh-hero-strip .toh-tile");
      if (!hero || !tiles.length) return;

      gsap.from(tiles, {
        y: 60,
        opacity: 0,
        duration: 1.1,
        stagger: 0.07,
        delay: 0.45,
        ease: "power3.out",
      });

      gsap.to(tiles, {
        yPercent: (i) => -6 - i * 2,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      const setters = tiles.map((tile, i) => ({
        x: gsap.quickTo(tile, "x", { duration: 0.9, ease: "power3.out" }),
        y: gsap.quickTo(tile, "y", { duration: 0.9, ease: "power3.out" }),
        depth: 6 + (i % 3) * 5,
      }));

      const onMove = (e) => {
        const rect = hero.getBoundingClientRect();
        const dx = (e.clientX - rect.left) / rect.width - 0.5;
        const dy = (e.clientY - rect.top) / rect.height - 0.5;

        setters.forEach((setter) => {
          setter.x(dx * setter.depth);
          setter.y(dy * setter.depth);
        });
      };

      const onLeave = () =>
        setters.forEach((setter) => {
          setter.x(0);
          setter.y(0);
        });

      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);

      return () => {
        hero.removeEventListener("pointermove", onMove);
        hero.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: pageRef }
  );

  useGSAP(
    () => {
      // Each part lights its own row on the contents rail as it takes the
      // screen.
      gsap.utils.toArray(".toh-section").forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });

      // Frames rise as their rack arrives.
      gsap.utils.toArray(".toh-rack").forEach((rack) => {
        gsap.fromTo(
          rack.querySelectorAll(".toh-frame"),
          { y: 70, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: rack, start: "top 85%", once: true },
          }
        );
      });
    },
    { scope: pageRef, dependencies: [sections.length] }
  );

  const words = name.trim().split(" ");
  const lead = words.slice(0, -1).join(" ");
  const tail = words[words.length - 1];

  return (
    <div className="toh-case" ref={pageRef}>
      {/* ---------------------------------------------------------- hero */}
      <section className="toh-hero" ref={heroRef}>
        <div className="container toh-hero-inner">
          <div className="toh-hero-lead">
            <Copy delay={0.5}>
              <p className="sm toh-eyebrow">Featured Case Study</p>
            </Copy>

            <Copy delay={0.6}>
              <h1 className="toh-display toh-hero-title">
                {lead ? `${lead} ` : ""}
                <span className="toh-accent">{tail}</span>
              </h1>
            </Copy>
          </div>

          {/* The same tile the racks below are built from, laid out as an
              opening strip: one frame per part, so the hero previews the
              whole study. */}
          <div className="toh-hero-strip" aria-hidden="true">
            {HERO_FRAMES.map((src, i) => (
              <div className={`toh-tile toh-hero-tile--${i + 1}`} key={src}>
                {isVideo(src) ? (
                  <video src={src} autoPlay muted loop playsInline />
                ) : (
                  <img src={src} alt="" />
                )}
              </div>
            ))}
          </div>

          <div className="toh-hero-meta">
            {META.map((item) => (
              <div className="toh-meta-item" key={item.label}>
                <Copy delay={0.75}>
                  <p className="sm toh-muted">{item.label}</p>
                </Copy>
                <Copy delay={0.8}>
                  <p className="toh-meta-value">{item.value}</p>
                </Copy>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- brief */}
      <section className="toh-brief">
        <div className="container toh-brief-inner">
          <div className="toh-brief-lead">
            <Copy animateOnScroll={true}>
              <p className="sm toh-muted">The Brief</p>
            </Copy>

            <Copy animateOnScroll={true}>
              <h2 className="toh-display toh-brief-title">
                {"A room worth "}
                <span className="toh-accent">staying in</span>
              </h2>
            </Copy>

            <Copy animateOnScroll={true}>
              <p className="toh-copy">
                {`Cafe Toh is as much a room as a menu ${EM} art on the walls, food regulars order without looking, and a reason to sit longer than you meant to. We shot it in four parts, each one a different reason to walk in, and cut them so the feed reads as a place rather than a catalogue.`}
              </p>
            </Copy>
          </div>

          {/* Contents: all four parts, the ones that are shot linked
              through to their rack. */}
          <div className="toh-contents">
            <div className="toh-contents-head">
              <p className="sm toh-muted">Contents</p>
              <p className="sm toh-muted">
                {`${String(SECTIONS.length).padStart(2, "0")} Parts`}
              </p>
            </div>

            <ul className="toh-contents-list">
              {SECTIONS.map((item) => {
                const live = item.media.length > 0;

                const row = (
                  <>
                    <span className="sm toh-no">{item.number}</span>
                    <span className="toh-contents-name">{item.name}</span>
                    <span className="sm toh-contents-count">
                      {live ? String(item.media.length).padStart(2, "0") : "--"}
                    </span>
                  </>
                );

                return (
                  <li
                    className={live ? "is-live" : "is-pending"}
                    key={item.name}
                  >
                    {live ? (
                      <a href={`#${slugify(item.name)}`}>{row}</a>
                    ) : (
                      <span>{row}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ sections */}
      <div className="container toh-body">
        <aside className="toh-nav">
          <p className="sm toh-muted">Contents</p>

          <ul>
            {sections.map((item, i) => (
              <li
                key={item.name}
                className={i === active ? "is-active" : undefined}
              >
                <a href={`#${slugify(item.name)}`}>
                  <span className="sm toh-no">{item.number}</span>
                  <span className="toh-nav-name">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="toh-sections">
          {sections.map((item, i) => (
            <section
              className="toh-section"
              id={slugify(item.name)}
              key={item.name}
            >
              <div className="toh-section-head">
                <Copy animateOnScroll={true}>
                  <p className="sm toh-muted">
                    {`${item.number} / ${String(item.media.length).padStart(
                      2,
                      "0"
                    )} frames`}
                  </p>
                </Copy>

                <Copy animateOnScroll={true}>
                  <h2 className="toh-display toh-section-title">{item.name}</h2>
                </Copy>

                <Copy animateOnScroll={true}>
                  <p className="toh-copy">{item.copy}</p>
                </Copy>
              </div>

              <Rack
                items={item.media}
                name={item.name}
                onOpen={(index) => openViewer(i, index)}
              />
            </section>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------- outcome */}
      <section className="toh-outcomes">
        <div className="container">

          {OUTCOMES.map((outcome, i) => (
            <div className="toh-outcome" key={outcome.title}>
              <div className="toh-outcome-head">
                <Copy animateOnScroll={true}>
                  <p className="sm toh-muted">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                </Copy>
                <Copy animateOnScroll={true}>
                  <h2 className="toh-display toh-outcome-title">
                    {outcome.title}
                  </h2>
                </Copy>
              </div>

              <div className="toh-outcome-value">
                <Copy animateOnScroll={true}>
                  <p>{outcome.value}</p>
                </Copy>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- closing */}
      <section className="toh-closing">
        <div className="container toh-closing-inner">
          <Copy animateOnScroll={true}>
            <p className="sm toh-muted">Next</p>
          </Copy>

          <Copy animateOnScroll={true}>
            <h2 className="toh-display toh-closing-title">
              {next ? next.name : "Your brand"}
            </h2>
          </Copy>

          <Button
            animateOnScroll={true}
            delay={0.25}
            href={next ? next.href : "/contact"}
          >
            {next ? "View the case study" : "Start your story"}
          </Button>
        </div>
      </section>

      <Footer />

      <Lightbox
        open={viewer.open}
        items={sections[viewer.section]?.media ?? []}
        index={viewer.index}
        name={sections[viewer.section]?.name ?? name}
        onClose={closeViewer}
        onStep={stepViewer}
      />
    </div>
  );
};

export default CafeToh;
