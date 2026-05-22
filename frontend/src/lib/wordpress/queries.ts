export const CWS_SITE_SETTINGS = `
  query CwsSiteSettings {
    cwsSiteSettings
  }
`;

export const CWS_PRICING_OPTIONS = `
  query CwsPricingOptions {
    cwsPricingOptions
  }
`;

export const CWS_HOMEPAGE = `
  query CwsHomepage {
    cwsHomepage
  }
`;

export const CWS_PAGE = `
  query CwsPage($slug: String!) {
    cwsPage(slug: $slug)
  }
`;

export const CWS_SERVICE_LANDING = `
  query CwsServiceLanding($slug: String!) {
    cwsServiceLanding(slug: $slug)
  }
`;

export const CWS_SERVICE = `
  query CwsService($slug: String!) {
    cwsService(slug: $slug)
  }
`;

export const CWS_MENUS = `
  query CwsMenus {
    cwsMenus
  }
`;

export const CWS_BLOG_POSTS = `
  query CwsBlogPosts {
    cwsBlogPosts
  }
`;

export const CWS_ALL_SLUGS = `
  query CwsAllSlugs {
    cwsAllSlugs
  }
`;

export const CWS_SERVICE_LANDINGS = `
  query CwsServiceLandings {
    cwsServiceLandings
  }
`;
