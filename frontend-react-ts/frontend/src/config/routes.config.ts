// Route path constants. Import ROUTES instead of typing raw path strings
// in <Link to="..."> or navigate(...) calls — one typo in a raw string
// won't be caught by TypeScript, but ROUTES.products will be.

export const ROUTES = {
  home: '/',
  about: '/about',
  products: '/products',
  productDetail: (slug: string) => `/products/${slug}`,
  securitySolutions: '/security-solutions',
  contact: '/contact',
} as const;
