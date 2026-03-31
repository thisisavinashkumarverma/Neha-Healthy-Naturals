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
import { useAuth } from './context/AuthContext'
import { createCheckoutDraftForUser, defaultUser } from './services/authservieces'
import useShopState from './hooks/useShopState'
import ProtectedRoute from './routes/ProtectedRoute'
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
  const { currentUser, isAuthenticated, login, signup, logout } = useAuth()
  const routerNavigate = useNavigate()
  const location = useLocation()
  const shop = useShopState()

  const navigate = (routeKey) => {
    routerNavigate(getRoutePath(routeKey))
  }

  const handleAdminEntry = () => {
    navigate(currentUser.role === 'admin' ? 'admin-insights' : 'login')
  }

  const handleLogin = ({ name, email, role }) => {
    const nextUser = login({ name, email, role })
    shop.setCheckoutDraft(createCheckoutDraftForUser(nextUser))
    navigate(nextUser.role === 'admin' ? 'admin-insights' : 'home')
  }

  const handleSignup = ({ name, email }) => {
    const nextUser = signup({ name, email })
    shop.setCheckoutDraft(createCheckoutDraftForUser(nextUser))
    navigate('home')
  }

  const handleLogout = () => {
    logout()
    shop.resetAfterLogout()
    shop.setCheckoutDraft(createCheckoutDraftForUser(defaultUser))
    navigate('landing')
  }

  const handleStartCheckout = (details) => {
    shop.handleStartCheckout(details)
    navigate('home-payment')
  }

  const handlePlaceOrder = (paymentPayload) => {
    const orderId = shop.handlePlaceOrder(paymentPayload)
    if (orderId) {
      navigate('home-orders')
    }
  }

  const landingPageProps = {
    activeSection: getLandingSectionFromPath(location.pathname),
    products: shop.storefrontProducts,
    onNavigate: navigate,
    onLoginClick: () => navigate('login'),
    onSignupClick: () => navigate('signup'),
    isAuthenticated: isAuthenticated && currentUser.role === 'customer',
  }

  const customerHomeProps = {
    activeSection: getHomeSectionFromPath(location.pathname),
    user: currentUser,
    products: shop.storefrontProducts,
    cartItems: shop.cartItems,
    wishlist: shop.wishlist,
    orders: shop.orders,
    cartCount: shop.cartCount,
    onLogout: handleLogout,
    onNavigate: navigate,
    onOpenAdmin: handleAdminEntry,
    onAddToCart: shop.handleAddToCart,
    onToggleWishlist: shop.handleToggleWishlist,
    onUpdateCartQuantity: shop.handleUpdateCartQuantity,
    onOpenCart: () => navigate('home-cart'),
    onOpenOrders: () => navigate('home-orders'),
  }

  const adminPanelProps = {
    activeSection: getAdminSectionFromPath(location.pathname),
    user: currentUser,
    products: shop.products,
    orders: shop.orders,
    onLogout: handleLogout,
    onNavigate: navigate,
    onOpenStore: () => navigate('home'),
    onAdjustInventory: shop.handleAdjustInventory,
    onToggleFeatured: shop.handleToggleFeatured,
    onAddProduct: shop.handleAddProduct,
    onTogglePublish: shop.handleTogglePublish,
    onUpdateOrderStatus: shop.handleUpdateOrderStatus,
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
              onBack={() => navigate('landing')}
              onLogin={handleLogin}
              onSignupLink={() => navigate('signup')}
              onNavigate={navigate}
            />
          }
        />

        <Route
          path={ROUTE_PATHS.signup}
          element={
            <SignupPage
              onBack={() => navigate('landing')}
              onSignup={handleSignup}
              onLoginLink={() => navigate('login')}
              onNavigate={navigate}
            />
          }
        />

        {CUSTOMER_HOME_ROUTE_KEYS.map((routeKey) => (
          <Route
            key={routeKey}
            path={getRoutePath(routeKey)}
            element={
              <ProtectedRoute allow={isAuthenticated && currentUser.role === 'customer'} redirectTo={ROUTE_PATHS.login}>
                <HomePage {...customerHomeProps} />
              </ProtectedRoute>
            }
          />
        ))}

        <Route
          path={ROUTE_PATHS['home-cart']}
          element={
            <ProtectedRoute allow={isAuthenticated && currentUser.role === 'customer'} redirectTo={ROUTE_PATHS.login}>
              <CartPage
                user={currentUser}
                products={shop.storefrontProducts}
                cartItems={shop.cartItems}
                checkoutDraft={shop.checkoutDraft}
                cartCount={shop.cartCount}
                orders={shop.orders}
                onLogout={handleLogout}
                onNavigate={navigate}
                onOpenAdmin={handleAdminEntry}
                onUpdateCartQuantity={shop.handleUpdateCartQuantity}
                onStartCheckout={handleStartCheckout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTE_PATHS['home-orders']}
          element={
            <ProtectedRoute allow={isAuthenticated && currentUser.role === 'customer'} redirectTo={ROUTE_PATHS.login}>
              <OrdersPage
                user={currentUser}
                orders={shop.orders}
                cartCount={shop.cartCount}
                onLogout={handleLogout}
                onNavigate={navigate}
                onOpenAdmin={handleAdminEntry}
                onCancelOrder={shop.handleCancelOrder}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTE_PATHS['home-payment']}
          element={
            <ProtectedRoute allow={isAuthenticated && currentUser.role === 'customer'} redirectTo={ROUTE_PATHS.login}>
              <PaymentPage
                user={currentUser}
                products={shop.storefrontProducts}
                cartItems={shop.cartItems}
                checkoutDraft={shop.checkoutDraft}
                cartCount={shop.cartCount}
                orders={shop.orders}
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
              <ProtectedRoute allow={isAuthenticated && currentUser.role === 'admin'} redirectTo={ROUTE_PATHS.login}>
                <AdminPanel {...adminPanelProps} />
              </ProtectedRoute>
            }
          />
        ))}

        <Route path="*" element={<LandingPage {...landingPageProps} />} />
      </Routes>

      {shop.toastMessage && <div className="app-toast">{shop.toastMessage}</div>}
    </div>
  )
}

export default AppRoutes
