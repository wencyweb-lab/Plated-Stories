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

// Cafe Toh is a record cafe, so the page is built as a record: four sides,
// each with its own crate of frames you drag through. `side` is the label on
// the rail; a section with no media yet is skipped, so filling one in later
// is a one-line change here and nothing else.
const SIDES = [
  {
    side: "A1",
    name: "Art vs Artist",
    copy: `The room and the people who make it ${EM} work on the walls set against the hands that plate, pour and pick the next record.`,
    media: [
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788380469/vewcbj.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788380469/hebdcks.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788380468/vehbkj.png",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1788380468/wiuer.png",
    ],
  },
  // Awaiting media — each side appears the moment its links land.
  {
    side: "A2",
    name: "Dishes That Keep Calling Back",
    copy: `The orders regulars don${RSQUO}t need the menu for, shot to earn the second visit.`,
    media: [],
  },
  {
    side: "B1",
    name: "Textures",
    copy: `Close enough to feel it ${EM} crumb, foam, grain and glaze at a distance no diner gets.`,
    media: [],
  },
  {
    side: "B2",
    name: "Vinyls",
    copy: `The other half of the room. Sleeves, spindles and the soundtrack the cafe is named for.`,
    media: [],
  },
];

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

// A single frame in a crate. Reels loop muted here; sound lives in the
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

// The crate: a horizontal rack you drag, throw or arrow through. Tiles sit
// at a slight tilt like records leaning in a box and straighten as they come
// under the cursor. Native overflow does the scrolling, so trackpads, wheels
// and touch all work without being re-implemented.
const Crate = ({ items, name, onOpen }) => {
  const railRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 });

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

  const onPointerDown = (e) => {
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
    <div className="toh-crate">
      <div
        className="toh-rail"
        ref={railRef}
        onScroll={readProgress}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
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

      <div className="toh-crate-foot">
        <div className="toh-scrub" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.max(progress, 0.06)})` }} />
        </div>

        <div className="toh-crate-controls">
          <p className="sm toh-hint">Drag</p>
          <button
            type="button"
            className="toh-round"
            onClick={() => step(-1)}
            aria-label={`Previous frame in ${name}`}
          >
            <LuArrowLeft size={16} />
          </button>
          <button
            type="button"
            className="toh-round"
            onClick={() => step(1)}
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

        <div className="toh-crate-controls">
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
  const vinylRef = useRef(null);
  const [active, setActive] = useState(0);
  const [viewer, setViewer] = useState({ open: false, side: 0, index: 0 });

  const sides = SIDES.filter((item) => item.media.length > 0);

  const openViewer = (sideIndex, index) =>
    setViewer({ open: true, side: sideIndex, index });

  const stepViewer = useCallback(
    (direction) => {
      setViewer((current) => {
        const items = sides[current.side]?.media ?? [];
        if (!items.length) return current;
        const nextIndex =
          (current.index + direction + items.length) % items.length;
        return { ...current, index: nextIndex };
      });
    },
    [sides]
  );

  const closeViewer = useCallback(
    () => setViewer((current) => ({ ...current, open: false })),
    []
  );

  useGSAP(
    () => {
      // The record turns on its own and picks up speed while the hero is
      // under the cursor; scrolling spins it too, so the page reads as one
      // continuous rotation.
      if (vinylRef.current) {
        const spin = gsap.to(vinylRef.current, {
          rotation: 360,
          duration: 12,
          ease: "none",
          repeat: -1,
        });

        gsap.to(vinylRef.current, {
          rotation: "+=540",
          ease: "none",
          scrollTrigger: {
            trigger: ".toh-hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        const hero = document.querySelector(".toh-hero");
        const speedUp = () => gsap.to(spin, { timeScale: 3, duration: 0.6 });
        const slowDown = () => gsap.to(spin, { timeScale: 1, duration: 0.9 });

        hero?.addEventListener("pointerenter", speedUp);
        hero?.addEventListener("pointerleave", slowDown);

        // The tonearm drops onto the record as the hero leaves.
        gsap.fromTo(
          ".toh-arm",
          { rotate: -22 },
          {
            rotate: 4,
            ease: "none",
            scrollTrigger: {
              trigger: ".toh-hero",
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }

      // Each side lights its own row on the tracklist as it takes the screen.
      gsap.utils.toArray(".toh-side").forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });

      // Frames rise as their crate arrives.
      gsap.utils.toArray(".toh-crate").forEach((crate) => {
        gsap.fromTo(
          crate.querySelectorAll(".toh-frame"),
          { y: 70, opacity: 0, rotate: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: crate, start: "top 85%", once: true },
          }
        );
      });
    },
    { scope: pageRef, dependencies: [sides.length] }
  );

  const words = name.trim().split(" ");
  const lead = words.slice(0, -1).join(" ");
  const tail = words[words.length - 1];

  return (
    <div className="toh-case" ref={pageRef}>
      {/* ---------------------------------------------------------- hero */}
      <section className="toh-hero">
        <div className="toh-deck" aria-hidden="true">
          <div className="toh-vinyl" ref={vinylRef}>
            <div className="toh-vinyl-label">
              <span className="sm">Side A</span>
              <span className="sm">33⅓</span>
            </div>
          </div>
          <div className="toh-arm" />
        </div>

        <div className="container toh-hero-inner">
          <Copy delay={0.5}>
            <p className="sm toh-eyebrow">Featured Case Study</p>
          </Copy>

          <Copy delay={0.6}>
            <h1 className="toh-display toh-hero-title">
              {lead ? `${lead} ` : ""}
              <span className="toh-accent">{tail}</span>
            </h1>
          </Copy>

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
          <Copy animateOnScroll={true}>
            <p className="sm toh-muted">The Brief</p>
          </Copy>

          <Copy animateOnScroll={true}>
            <h2 className="toh-display toh-brief-title">
              {"A cafe that plays "}
              <span className="toh-accent">its own record</span>
            </h2>
          </Copy>

          <Copy animateOnScroll={true}>
            <p className="toh-copy">
              {`Cafe Toh is as much a room as a menu ${EM} art on the walls, records on the deck, food that regulars order without looking. We shot it in four sides, each one a different reason to walk in, and cut them so the feed plays like a set rather than a catalogue.`}
            </p>
          </Copy>
        </div>
      </section>

      {/* --------------------------------------------------------- sides */}
      <div className="container toh-body">
        <aside className="toh-tracklist">
          <p className="sm toh-muted">Tracklist</p>

          <ul>
            {sides.map((item, i) => (
              <li
                key={item.name}
                className={i === active ? "is-active" : undefined}
              >
                <a href={`#${slugify(item.name)}`}>
                  <span className="sm toh-side-label">{item.side}</span>
                  <span className="toh-track-name">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="toh-sides">
          {sides.map((item, i) => (
            <section
              className="toh-side"
              id={slugify(item.name)}
              key={item.name}
            >
              <div className="toh-side-head">
                <Copy animateOnScroll={true}>
                  <p className="sm toh-muted">
                    {`${item.side} / ${String(item.media.length).padStart(
                      2,
                      "0"
                    )} frames`}
                  </p>
                </Copy>

                <Copy animateOnScroll={true}>
                  <h2 className="toh-display toh-side-title">{item.name}</h2>
                </Copy>

                <Copy animateOnScroll={true}>
                  <p className="toh-copy">{item.copy}</p>
                </Copy>
              </div>

              <Crate
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
          <Copy animateOnScroll={true}>
            <p className="sm toh-muted">The Outcome</p>
          </Copy>

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
            {next ? "Play the next side" : "Start your story"}
          </Button>
        </div>
      </section>

      <Footer />

      <Lightbox
        open={viewer.open}
        items={sides[viewer.side]?.media ?? []}
        index={viewer.index}
        name={sides[viewer.side]?.name ?? name}
        onClose={closeViewer}
        onStep={stepViewer}
      />
    </div>
  );
};

export default CafeToh;
