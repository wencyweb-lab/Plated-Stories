// The three niches we shoot for, and the client projects under each.
// Mirrors the "Plated Stories - Portfolio" Drive structure.
//
// NOTE ON IMAGERY: the previews below are placeholders drawn from /public/loader
// (real studio photography, but all from the Love & Flour By Pooja shoot). Each
// project should get its own three stills once the media from its Drive folder
// is exported into /public. Only `images` needs swapping — nothing else.
const previews = (start) => [
  `/loader/loader-${start}.jpg`,
  `/loader/loader-${start + 1}.jpg`,
  `/loader/loader-${start + 2}.jpg`,
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
      { name: "Cafe Srinivasa", images: previews(4) },
      { name: "Cafe Toh", images: previews(7) },
      { name: "Dine & Discover", images: previews(10) },
      { name: "Hive Cafe", images: previews(13) },
      { name: "Home Bakers", images: previews(16) },
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
