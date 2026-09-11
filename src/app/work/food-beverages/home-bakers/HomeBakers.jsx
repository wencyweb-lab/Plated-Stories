"use client";
import "@/components/CaseStudy/CaseStudy.css";
import "./home-bakers.css";
import { useCallback, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Footer from "@/components/Footer/Footer";
import Copy from "@/components/Copy/Copy";
import Button from "@/components/Button/Button";
import ContentsIndex from "@/components/CaseStudy/ContentsIndex";
import SeriesSection from "@/components/CaseStudy/SeriesSection";
import Lightbox from "@/components/CaseStudy/Lightbox";
import { isVideo } from "@/components/CaseStudy/media";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Body copy lives in plain string constants rather than inline JSX text:
// GSAP's SplitText rebuilds the text nodes it splits and trims each one's
// leading whitespace, so a sentence broken across `{expr}` boundaries loses
// the spaces around them. One text node, one string.
const EM = "—";
const RSQUO = "’";

const META = [
  { label: "Client", value: "Home Bakers" },
  { label: "Category", value: "Food & Beverages" },
  { label: "Services", value: "Strategy, Production, Editing" },
];

// Five home baking labels, each rendered as its own chapter: label, title,
// copy, then the media. A label with no media yet is listed in the contents
// but has no section, so filling one in later is a one-line change here
// and nothing else.
const SECTIONS = [
  {
    number: "01",
    name: "Delightful Delicacies",
    copy: `Small-batch bakes shot the way they're actually sold ${EM} one home kitchen, one box at a time.`,
    marquee: true,
    // Two strips instead of one, running opposite ways.
    marqueeRows: 2,
    media: [
      "https://res.cloudinary.com/vaxfpcja/video/upload/v1789114078/1._Hamper.mp4",
      "https://res.cloudinary.com/vaxfpcja/video/upload/v1789114071/1._DIY.mp4",
      "https://res.cloudinary.com/vaxfpcja/video/upload/v1789114064/2._Cake_Canvas.mp4",
      // Source exports are HEIC — swapped to .jpg so Cloudinary re-encodes
      // them, since browsers can't render HEIC in an <img>.
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114054/bdshc.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114059/evgbjwhk.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114059/vycgxjbhns.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114058/vghbxjk.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114058/gfecbwhdjkcdw.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114057/vfdwbjk.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114057/vecwbjhkn.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114057/jbfvhbfve.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114057/hddc.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114057/cyfewdjbhkc.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114056/beyvhbyef.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114056/fvtdcwbhn.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114055/vedbwhknxj.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114056/vfygdbwjh_sx.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114055/fvcgdbhnkj.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114055/evygbxhjwns.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114054/e_rhgwjxk.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114054/gfvedhwjxkj.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114054/vgehbjx.jpg",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114054/df_vhgs_k.jpg",
      // This one HEIC is grid-tiled — a plain extension swap fails to
      // re-encode it (Cloudinary error: "Cannot read grid descriptor"), so
      // it needs the f_auto transform instead, kept on its original .heic
      // path.
      "https://res.cloudinary.com/vaxfpcja/image/upload/f_auto/v1789114054/vyegwbjxhnkj.heic",
      "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114054/hvegwbjnk.jpg",
    ],
  },
  {
    number: "02",
    name: "Happy Box by Eishika",
    copy: `A baker's own name on the label, so the story behind the box gets the same frame as the bake.`,
    media: [],
  },
  {
    number: "03",
    name: "Juno's",
    copy: `The bakes a small following already orders on repeat, shot to earn the next one.`,
    media: [],
  },
  {
    number: "04",
    name: "Mewa",
    copy: `Ingredient-forward bakes ${EM} the dried fruit and nut doing the work a filter usually would.`,
    media: [],
  },
  {
    number: "05",
    name: "Only Desserts",
    copy: `Nothing but the finish ${EM} the plate cleared down to just what${RSQUO}s worth photographing.`,
    media: [],
  },
];

// The opening frames, borrowed for the hero strip. One per part first, so
// the strip previews the whole study rather than just its first chapter.
const HERO_FRAMES = [
  ...SECTIONS.flatMap((item) => item.media.slice(0, 1)),
  ...SECTIONS.flatMap((item) => item.media.slice(1)),
].slice(0, 5);

const OUTCOMES = [
  { title: "Deliverables", value: "Content Strategy, Reels & Carousels" },
  { title: "Community", value: "Highly Engaged & Loyal" },
  { title: "Brand Impact", value: "Stronger Recognition & Recall" },
];

const HomeBakers = ({ name, next }) => {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const [viewer, setViewer] = useState({ open: false, section: 0, index: 0 });

  const sections = SECTIONS.filter((item) => item.media.length > 0);

  const openViewer = (section, index) =>
    setViewer({ open: true, section, index });

  const stepViewer = useCallback(
    (direction) => {
      setViewer((current) => {
        const items = sections[current.section]?.media ?? [];
        if (!items.length) return current;
        return {
          ...current,
          index: (current.index + direction + items.length) % items.length,
        };
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
      const tiles = gsap.utils.toArray(".hb-hero-strip .hb-tile");
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

  // Frames in a grid chapter rise as they cross the fold. A marquee is
  // already moving, so it is left alone — animating a tile inside an
  // animating track only fights it.
  useGSAP(
    () => {
      gsap.utils.toArray(".cs-gallery > .cs-frame").forEach((frame) => {
        gsap.fromTo(
          frame,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: frame, start: "top 88%", once: true },
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
    <div className="case-study hb-case" ref={pageRef}>
      {/* ---------------------------------------------------------- hero */}
      <section className="hb-hero" ref={heroRef}>
        <div className="container hb-hero-inner">
          <div className="hb-hero-lead">
            <Copy delay={0.5}>
              <p className="sm cs-index">Featured Case Study</p>
            </Copy>

            <Copy delay={0.6}>
              <h1 className="cs-display hb-hero-title">
                {lead ? `${lead} ` : ""}
                <span className="cs-accent">{tail}</span>
              </h1>
            </Copy>
          </div>

          {/* One frame per part, laid out as an opening strip, so the hero
              previews the whole study. */}
          <div className="hb-hero-strip" aria-hidden="true">
            {HERO_FRAMES.map((src, i) => (
              <div className={`hb-tile hb-hero-tile--${i + 1}`} key={src}>
                {isVideo(src) ? (
                  <video src={src} autoPlay muted loop playsInline />
                ) : (
                  <img src={src} alt="" />
                )}
              </div>
            ))}
          </div>

          <div className="hb-hero-meta">
            {META.map((item) => (
              <div className="hb-meta-item" key={item.label}>
                <Copy delay={0.75}>
                  <p className="sm cs-index">{item.label}</p>
                </Copy>
                <Copy delay={0.8}>
                  <p className="hb-meta-value">{item.value}</p>
                </Copy>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- brief */}
      <section className="hb-brief">
        <div className="container hb-brief-inner">
          <div className="hb-brief-lead">
            <Copy animateOnScroll={true}>
              <p className="sm cs-index">The Brief</p>
            </Copy>

            <Copy animateOnScroll={true}>
              <h2 className="cs-display hb-brief-title">
                {"Five kitchens worth "}
                <span className="cs-accent">discovering</span>
              </h2>
            </Copy>

            <Copy animateOnScroll={true}>
              <p className="cs-copy">
                {`Home Bakers brings five independent home-kitchen brands under one lens ${EM} each with its own name, its own following and its own reason people order again. We shot each one as its own chapter rather than folding them into a single generic feed.`}
              </p>
            </Copy>
          </div>

          {/* All five labels; the ones that are shot link through to their
              chapter, the rest hold their place. */}
          <ContentsIndex items={SECTIONS} unit="Bakers" />
        </div>
      </section>

      {/* ------------------------------------------------------ chapters */}
      <div className="hb-sections">
        {sections.map((item, i) => (
          <SeriesSection
            key={item.name}
            item={item}
            index={i}
            dark={i % 2 === 1}
            label="Baker"
            onOpen={(index) => openViewer(i, index)}
          />
        ))}
      </div>

      {/* ------------------------------------------------------- outcome */}
      <section className="cs-outcomes">
        <div className="container">
          <Copy animateOnScroll={true}>
            <p className="sm cs-index">The Outcome</p>
          </Copy>

          {OUTCOMES.map((outcome, i) => (
            <div className="cs-outcome" key={outcome.title}>
              <div className="cs-outcome-head">
                <Copy animateOnScroll={true}>
                  <p className="sm cs-index">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                </Copy>
                <Copy animateOnScroll={true}>
                  <h2 className="cs-display cs-outcome-title">
                    {outcome.title}
                  </h2>
                </Copy>
              </div>

              <div className="cs-outcome-value">
                <Copy animateOnScroll={true}>
                  <p>{outcome.value}</p>
                </Copy>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- closing */}
      <section className="cs-closing">
        <div className="container cs-closing-inner">
          <Copy animateOnScroll={true}>
            <p className="sm cs-index">Next</p>
          </Copy>

          <Copy animateOnScroll={true}>
            <h2 className="cs-display cs-closing-title">
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

export default HomeBakers;
