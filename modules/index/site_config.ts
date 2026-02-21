// Site-wide SEO / social defaults
export const twitterSite = "@fastrodev"; // set to empty string to disable
export const ogImageWidth = 1200;
export const ogImageHeight = 630;

// Hreflang / locales configuration
// Provide the public base URL for each locale. Order does not matter.
// Example: [{ lang: 'en', url: 'https://fastro.dev' }, { lang: 'id', url: 'https://fastro.dev/id' }]
export const locales: Array<{ lang: string; url: string }> = [
  { lang: "en", url: "https://fastro.dev" },
  { lang: "id", url: "https://fastro.dev/id" },
];
export const defaultLocale = "en";

export default {
  twitterSite,
  ogImageWidth,
  ogImageHeight,
  locales,
  defaultLocale,
};
