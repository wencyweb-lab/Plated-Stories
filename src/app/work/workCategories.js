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

export const workCategories = [
  {
    key: "food-beverages",
    title: "Food & Beverages",
    projects: [
      { name: "Baked by Nini's", href: "/sample-project", images: previews(1) },
      { name: "Cafe Srinivasa", href: "/sample-project", images: previews(4) },
      { name: "Cafe Toh", href: "/sample-project", images: previews(7) },
      { name: "Dine & Discover", href: "/sample-project", images: previews(10) },
      { name: "Hive Cafe", href: "/sample-project", images: previews(13) },
      { name: "Home Bakers", href: "/sample-project", images: previews(16) },
      { name: "Love & Flour", href: "/sample-project", images: previews(19) },
      { name: "Maison Faux", href: "/sample-project", images: previews(22) },
    ],
  },
  {
    key: "luxury-fashion",
    title: "Luxury & Fashion",
    projects: [
      { name: "Baftic", href: "/sample-project", images: previews(25) },
      { name: "Kyomi", href: "/sample-project", images: previews(28) },
      { name: "Midash", href: "/sample-project", images: previews(31) },
      { name: "My Watch Merchant", href: "/sample-project", images: previews(34) },
    ],
  },
  {
    key: "real-estate-architecture",
    title: "Real Estate & Architecture",
    projects: [
      { name: "Ukiyo Interiors", href: "/sample-project", images: previews(37) },
    ],
  },
];
