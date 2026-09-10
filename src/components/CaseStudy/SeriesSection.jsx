"use client";
import Copy from "@/components/Copy/Copy";
import MediaFrame from "./MediaFrame";
import { pad, slugify } from "./media";

// One chapter of a case study: the label, the title and the copy first, then
// the media underneath — read the section, then look at it. Alternating
// grounds (`dark`) break the page into chapters rather than one long scroll
// of galleries.
//
// Two layouts, chosen per series:
//   marquee  — an endless single-line strip, for sets big enough to run
//   grid     — a column layout at the series' own `columns` count
const SeriesSection = ({ item, index, dark, label = "Series", onOpen }) => {
  const landscape = item.frame === "landscape";
  // A section can also mark specific items as landscape rather than the
  // whole set — one wide reel mixed among otherwise vertical ones.
  const isItemLandscape = (src) => Boolean(item.landscapeMedia?.includes(src));

  return (
    <section
      className={`cs-series${dark ? " cs-series--dark" : ""}`}
      id={slugify(item.name)}
    >
      <div className="container cs-series-inner">
        <div className="cs-series-head">
          <Copy animateOnScroll={true}>
            <p className="sm cs-index">{`${pad(index + 1)} / ${label}`}</p>
          </Copy>

          <Copy animateOnScroll={true}>
            <h2 className="cs-display cs-series-title">{item.name}</h2>
          </Copy>

          {item.copy ? (
            <Copy animateOnScroll={true}>
              <p className="cs-copy">{item.copy}</p>
            </Copy>
          ) : null}
        </div>

        {item.marquee ? (
          // The track holds the set twice over and slides exactly one set's
          // width before looping, so the seam never shows. CSS owns the
          // motion — see .cs-marquee in the stylesheet — which keeps
          // pause-on-hover a single declaration rather than a scroll
          // listener.
          <div
            className={`cs-marquee${landscape ? " cs-marquee--landscape" : ""}`}
            style={{ "--marquee-duration": `${item.media.length * 7}s` }}
          >
            <div className="cs-marquee-track">
              {[...item.media, ...item.media].map((src, j) => {
                const source = j % item.media.length;
                return (
                  <MediaFrame
                    key={`${src}-${j}`}
                    src={src}
                    label={`${item.name} ${source + 1}`}
                    className="cs-marquee-item"
                    hidden={j >= item.media.length}
                    onOpen={onOpen ? () => onOpen(source) : undefined}
                    landscape={isItemLandscape(src)}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className={`cs-gallery${landscape ? " cs-gallery--landscape" : ""}`}
            style={{ "--cols": item.columns ?? 3 }}
          >
            {item.media.map((src, j) => (
              <MediaFrame
                key={src}
                src={src}
                label={`${item.name} ${j + 1}`}
                onOpen={onOpen ? () => onOpen(j) : undefined}
                landscape={isItemLandscape(src)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SeriesSection;
