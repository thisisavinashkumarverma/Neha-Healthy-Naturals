export const ROUTE_PATHS = {
  landing: '/',
  'landing-collections': '/collections',
  'landing-story': '/story',
  'landing-contact': '/contact',
  login: '/login',
  signup: '/signup',
  home: '/store',
  'home-collections': '/store/collections',
  'home-brand': '/store/about',
  'home-care': '/store/customer-care',
  'home-cart': '/store/cart',
  'home-orders': '/store/orders',
  'home-payment': '/store/payment',
  admin: '/admin/insights',
  'admin-insights': '/admin/insights',
  'admin-new-product': '/admin/new-product',
  'admin-inventory': '/admin/inventory',
  'admin-orders': '/admin/orders',
  'admin-payments': '/admin/payments',
}

export const LANDING_ROUTE_KEYS = [
  'landing',
  'landing-collections',
  'landing-story',
  'landing-contact',
]

export const CUSTOMER_HOME_ROUTE_KEYS = [
  'home',
  'home-collections',
  'home-brand',
  'home-care',
]

export const ADMIN_ROUTE_KEYS = [
  'admin-insights',
  'admin-new-product',
  'admin-inventory',
  'admin-orders',
  'admin-payments',
]

export const getRoutePath = (routeKey) => ROUTE_PATHS[routeKey] ?? ROUTE_PATHS.landing

export const getLandingSectionFromPath = (pathname) => {
  if (pathname === ROUTE_PATHS['landing-collections']) return 'collections'
  if (pathname === ROUTE_PATHS['landing-story']) return 'story'
  if (pathname === ROUTE_PATHS['landing-contact']) return 'contact'
  return 'home'
}

export const getHomeSectionFromPath = (pathname) => {
  if (pathname === ROUTE_PATHS['home-collections']) return 'collections'
  if (pathname === ROUTE_PATHS['home-brand']) return 'brand'
  if (pathname === ROUTE_PATHS['home-care']) return 'care'
  if (pathname === ROUTE_PATHS['home-cart']) return 'cart'
  if (pathname === ROUTE_PATHS['home-orders']) return 'orders'
  if (pathname === ROUTE_PATHS['home-payment']) return 'payment'
  return 'home'
}

export const getAdminSectionFromPath = (pathname) => {
  if (pathname === ROUTE_PATHS['admin-new-product']) return 'new-product'
  if (pathname === ROUTE_PATHS['admin-inventory']) return 'inventory'
  if (pathname === ROUTE_PATHS['admin-orders']) return 'orders'
  if (pathname === ROUTE_PATHS['admin-payments']) return 'payments'
  return 'insights'
}
