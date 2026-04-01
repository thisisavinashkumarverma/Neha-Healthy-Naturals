import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/landing-page/LandingPage'
import LoginPage from './pages/login-page/LoginPage'
import SignupPage from './pages/signup-page/SignupPage'
import HomePage from './pages/home-page/HomePage'
import AdminPanel from './pages/admin-panel/AdminPanel'
import CartPage from './pages/cart-page/CartPage'
import OrdersPage from './pages/orders-page/OrdersPage'
import PaymentPage from './pages/payment-page/PaymentPage'
import ProtectedRoute from './routes/ProtectedRoute'
import {
  sampleAdminUser,
  sampleCartItems,
  sampleCheckoutDraft,
  sampleCustomerUser,
  sampleOrders,
  sampleProducts,
  sampleStorefrontProducts,
  sampleWishlist,
} from './data/uiSamples'
import {
  ADMIN_ROUTE_KEYS,
  CUSTOMER_HOME_ROUTE_KEYS,
  getAdminSectionFromPath,
  getHomeSectionFromPath,
  getLandingSectionFromPath,
  getRoutePath,
  LANDING_ROUTE_KEYS,
  ROUTE_PATHS,
} from './routes/routePaths'

function AppRoutes() {
  const routerNavigate = useNavigate()
  const location = useLocation()
  const cartCount = sampleCartItems.reduce((count, item) => count + item.quantity, 0)

  const navigate = (routeKey) => {
    routerNavigate(getRoutePath(routeKey))
  }

  const handleAdminEntry = () => {
    navigate('admin-insights')
  }

  const handleLogout = () => {
    navigate('landing')
  }

  const handleStartCheckout = () => {
    navigate('home-payment')
  }

  const handlePlaceOrder = () => {
    navigate('home-orders')
  }

  const landingPageProps = {
    activeSection: getLandingSectionFromPath(location.pathname),
    products: sampleStorefrontProducts,
    onNavigate: navigate,
    onLoginClick: () => navigate('login'),
    onSignupClick: () => navigate('signup'),
    isAuthenticated: false,
  }

  const customerHomeProps = {
    activeSection: getHomeSectionFromPath(location.pathname),
    user: sampleCustomerUser,
    products: sampleStorefrontProducts,
    cartItems: sampleCartItems,
    wishlist: sampleWishlist,
    orders: sampleOrders,
    cartCount,
    onLogout: handleLogout,
    onNavigate: navigate,
    onOpenAdmin: handleAdminEntry,
    onAddToCart: undefined,
    onToggleWishlist: undefined,
    onUpdateCartQuantity: undefined,
    onOpenCart: () => navigate('home-cart'),
    onOpenOrders: () => navigate('home-orders'),
  }

  const adminPanelProps = {
    activeSection: getAdminSectionFromPath(location.pathname),
    user: sampleAdminUser,
    products: sampleProducts,
    orders: sampleOrders,
    onLogout: handleLogout,
    onNavigate: navigate,
    onOpenStore: () => navigate('home'),
    onAdjustInventory: undefined,
    onToggleFeatured: undefined,
    onAddProduct: undefined,
    onTogglePublish: undefined,
    onUpdateOrderStatus: undefined,
  }
  return (
    <div className="app-shell">
      <Routes>
        {LANDING_ROUTE_KEYS.map((routeKey) => (
          <Route key={routeKey} path={getRoutePath(routeKey)} element={<LandingPage {...landingPageProps} />} />
        ))}

        <Route
          path={ROUTE_PATHS.login}
          element={
            <LoginPage
            
           
              onNavigate={navigate}
            />
          }
        />

        <Route
          path={ROUTE_PATHS.signup}
          element={
            <SignupPage
              onBack={() => navigate('landing')}
           
              onNavigate={navigate}
            />
          }
        />

        {CUSTOMER_HOME_ROUTE_KEYS.map((routeKey) => (
          <Route
            key={routeKey}
            path={getRoutePath(routeKey)}
            element={
              <ProtectedRoute redirectTo={ROUTE_PATHS.login}>
                <HomePage {...customerHomeProps} />
              </ProtectedRoute>
            }
          />
        ))}

        <Route
          path={ROUTE_PATHS['home-cart']}
          element={
            <ProtectedRoute redirectTo={ROUTE_PATHS.login}>
              <CartPage
                user={sampleCustomerUser}
                products={sampleStorefrontProducts}
                cartItems={sampleCartItems}
                checkoutDraft={sampleCheckoutDraft}
                cartCount={cartCount}
                orders={sampleOrders}
                onLogout={handleLogout}
                onNavigate={navigate}
                onOpenAdmin={handleAdminEntry}
                onUpdateCartQuantity={undefined}
                onStartCheckout={handleStartCheckout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTE_PATHS['home-orders']}
          element={
            <ProtectedRoute redirectTo={ROUTE_PATHS.login}>
              <OrdersPage
                user={sampleCustomerUser}
                orders={sampleOrders}
                cartCount={cartCount}
                onLogout={handleLogout}
                onNavigate={navigate}
                onOpenAdmin={handleAdminEntry}
                onCancelOrder={undefined}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTE_PATHS['home-payment']}
          element={
            <ProtectedRoute redirectTo={ROUTE_PATHS.login}>
              <PaymentPage
                user={sampleCustomerUser}
                products={sampleStorefrontProducts}
                cartItems={sampleCartItems}
                checkoutDraft={sampleCheckoutDraft}
                cartCount={cartCount}
                orders={sampleOrders}
                onLogout={handleLogout}
                onNavigate={navigate}
                onOpenAdmin={handleAdminEntry}
                onBackToCart={() => navigate('home-cart')}
                onPlaceOrder={handlePlaceOrder}
              />
            </ProtectedRoute>
          }
        />

        {ADMIN_ROUTE_KEYS.map((routeKey) => (
          <Route
            key={routeKey}
            path={getRoutePath(routeKey)}
            element={
              <ProtectedRoute redirectTo={ROUTE_PATHS.login}>
                <AdminPanel {...adminPanelProps} />
              </ProtectedRoute>
            }
          />
        ))}

        <Route path="*" element={<LandingPage {...landingPageProps} />} />
      </Routes>
    </div>
  )
}

export default AppRoutes
