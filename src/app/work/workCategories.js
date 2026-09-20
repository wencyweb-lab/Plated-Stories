// The three niches we shoot for, and the client projects under each.
// Mirrors the "Plated Stories - Portfolio" Drive structure.
//
// NOTE ON IMAGERY: `previews` used to point at /public/loader/loader-N.jpg,
// placeholders that were never actually added to /public — every folder
// preview on /work 404'd. Projects with their own case-study page (Cafe
// Srinivasa, Cafe Toh, Hive Cafe, Home Bakers, Dine & Discover) now get three
// real stills pulled straight from that page's own media. Everything else
// (no case-study media exported yet) falls back to a rotating slice of the
// shared Cloudinary studio pool, so a project only needs `images` swapped
// for its own stills once its Drive folder is exported.
const STUDIO_POOL = [
  "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374646/4.png",
  "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374646/2.png",
  "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374646/5.png",
  "https://res.cloudinary.com/vaxfpcja/image/upload/v1788375825/as.png",
  "https://res.cloudinary.com/vaxfpcja/image/upload/v1788375825/er.png",
  "https://res.cloudinary.com/vaxfpcja/image/upload/v1788375825/2d.png",
  "https://res.cloudinary.com/vaxfpcja/image/upload/v1788381159/cghbjh.png",
  "https://res.cloudinary.com/vaxfpcja/image/upload/v1788381159/xfgcfhgh.png",
  "https://res.cloudinary.com/vaxfpcja/image/upload/v1788982241/sdg.png",
  "https://res.cloudinary.com/vaxfpcja/image/upload/v1788982239/grd.png",
  "https://res.cloudinary.com/vaxfpcja/image/upload/v1788982240/gdh.png",
  "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114058/vghbxjk.jpg",
  "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114058/gfecbwhdjkcdw.jpg",
];

const previews = (offset) => [
  STUDIO_POOL[offset % STUDIO_POOL.length],
  STUDIO_POOL[(offset + 1) % STUDIO_POOL.length],
  STUDIO_POOL[(offset + 2) % STUDIO_POOL.length],
];

// Turns a project name into its URL slug, e.g. "Dine & Discover" ->
// "dine-and-discover". Apostrophes and every other non-alphanumeric are
// dropped rather than kept: they would have to survive percent-encoding on
// every round trip through the router and the route folder name, so
// "Baked by Nini's" -> "baked-by-ninis". Keep the folder under
// src/app/work/<category>/ named exactly as this produces.
const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const categoriesData = [
  {
    key: "food-beverages",
    title: "Food & Beverages",
    projects: [
      {
        name: "Baked by Nini's",
        images: previews(1),
        heroVideo:
          "https://res.cloudinary.com/vaxfpcja/video/upload/v1788365967/1._Monsoon_Vibe.mp4",
      },
      {
        name: "Cafe Srinivasa",
        images: [
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374078/1_1.png",
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1789768231/2_1.jpg",
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1788374646/3.png",
        ],
      },
      {
        name: "Cafe Toh",
        images: [
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1788380469/vewcbj.png",
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1788380469/hebdcks.png",
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1788380468/vehbkj.png",
        ],
      },
      {
        name: "Dine & Discover",
        images: [
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1788982241/gjhv.png",
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1788982241/fdxgch.png",
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1788982241/hg.png",
        ],
      },
      {
        name: "Hive Cafe",
        images: [
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1789111825/Copy_of_Hive_Carousels_-_2_1.png",
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1789111825/Copy_of_Hive_Carousels_-_3_1.png",
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1789111825/Copy_of_Hive_Carousels_-_4_1.png",
        ],
      },
      {
        name: "Home Bakers",
        images: [
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114054/bdshc.jpg",
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114059/evgbjwhk.jpg",
          "https://res.cloudinary.com/vaxfpcja/image/upload/v1789114059/vycgxjbhns.jpg",
        ],
      },
      { name: "Love & Flour", images: previews(19) },
      { name: "Maison Faux", images: previews(22) },
    ],
  },
  {
    key: "luxury-fashion",
    title: "Luxury & Fashion",
    projects: [
      { name: "Baftic", images: previews(25) },
      { name: "Kyomi", images: previews(28) },
      { name: "Midash", images: previews(31) },
      { name: "My Watch Merchant", images: previews(34) },
    ],
  },
  {
    key: "real-estate-architecture",
    title: "Real Estate & Architecture",
    projects: [
      { name: "Ukiyo Interiors", images: previews(37) },
    ],
  },
];

export const workCategories = categoriesData.map((category) => ({
  ...category,
  projects: category.projects.map((project) => {
    const slug = slugify(project.name);
    return {
      ...project,
      slug,
      href: `/work/${category.key}/${slug}`,
    };
  }),
}));
