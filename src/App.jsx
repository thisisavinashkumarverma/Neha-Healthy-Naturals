import { useEffect, useState } from 'react'
import './App.css'
import LandingPage from './pages/landing-page/LandingPage'
import LoginPage from './pages/login-page/LoginPage'
import SignupPage from './pages/signup-page/SignupPage'
import HomePage from './pages/home-page/HomePage'
import AdminPanel from './pages/admin-panel/AdminPanel'
import CartPage from './pages/cart-page/CartPage'
import OrdersPage from './pages/orders-page/OrdersPage'
import PaymentPage from './pages/payment-page/PaymentPage'
import { initialProducts } from './data/catalog'

const STORAGE_KEY = 'nhn-app-state'

const publicRoutes = new Set([
  'landing',
  'landing-collections',
  'landing-story',
  'landing-contact',
  'login',
  'signup',
])

const customerRoutes = new Set([
  'home',
  'home-collections',
  'home-brand',
  'home-care',
  'home-cart',
  'home-orders',
  'home-payment',
])

const adminRoutes = new Set([
  'admin',
  'admin-insights',
  'admin-new-product',
  'admin-inventory',
  'admin-orders',
  'admin-payments',
])

const defaultUser = {
  name: 'Priya',
  email: 'priya@nhn.com',
  role: 'customer',
}

const defaultCheckoutDraft = {
  customerName: defaultUser.name,
  customerEmail: defaultUser.email,
  address: '',
  phone: '',
  notes: '',
}

const getDefaultProducts = () => initialProducts.map((product) => ({ ...product, published: true }))

const loadStoredState = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY)
    return rawState ? JSON.parse(rawState) : null
  } catch {
    return null
  }
}

function App() {
  const storedState = loadStoredState()
  const [currentView, setCurrentView] = useState(storedState?.currentView ?? 'landing')
  const [currentUser, setCurrentUser] = useState(storedState?.currentUser ?? defaultUser)
  const [isAuthenticated, setIsAuthenticated] = useState(storedState?.isAuthenticated ?? false)
  const [products, setProducts] = useState(storedState?.products ?? getDefaultProducts())
  const [cartItems, setCartItems] = useState(storedState?.cartItems ?? [])
  const [wishlist, setWishlist] = useState(storedState?.wishlist ?? [])
  const [orders, setOrders] = useState(storedState?.orders ?? [])
  const [toastMessage, setToastMessage] = useState('')
  const [checkoutDraft, setCheckoutDraft] = useState(storedState?.checkoutDraft ?? defaultCheckoutDraft)

  const navigate = (view) => {
    if (publicRoutes.has(view)) {
      setCurrentView(view)
      return
    }

    if (customerRoutes.has(view)) {
      if (!isAuthenticated) {
        setCurrentView('login')
        return
      }

      if (currentUser.role !== 'customer') {
        setCurrentView('admin')
        return
      }

      setCurrentView(view)
      return
    }

    if (adminRoutes.has(view)) {
      if (!isAuthenticated) {
        setCurrentView('login')
        return
      }

      if (currentUser.role !== 'admin') {
        setCurrentView('home')
        return
      }

      setCurrentView(view)
    }
  }

  const getLandingSection = () => {
    if (currentView === 'landing-collections') return 'collections'
    if (currentView === 'landing-story') return 'story'
    if (currentView === 'landing-contact') return 'contact'
    return 'home'
  }

  const getHomeSection = () => {
    if (currentView === 'home-collections') return 'collections'
    if (currentView === 'home-brand') return 'brand'
    if (currentView === 'home-care') return 'care'
    if (currentView === 'home-cart') return 'cart'
    if (currentView === 'home-orders') return 'orders'
    if (currentView === 'home-payment') return 'payment'
    return 'home'
  }

  const getAdminSection = () => {
    if (currentView === 'admin-new-product') return 'new-product'
    if (currentView === 'admin-inventory') return 'inventory'
    if (currentView === 'admin-orders') return 'orders'
    if (currentView === 'admin-payments') return 'payments'
    return 'insights'
  }

  const handleAdminEntry = () => {
    if (currentUser.role === 'admin') {
      navigate('admin-insights')
      return
    }

    navigate('login')
  }

  const handleLogin = ({ name, email, role }) => {
    const resolvedName = name?.trim() || (role === 'admin' ? 'Admin' : 'Customer')

    setCurrentUser({
      name: resolvedName,
      email: email?.trim() || `${resolvedName.toLowerCase()}@nhn.com`,
      role,
    })
    setIsAuthenticated(true)
    setCheckoutDraft({
      customerName: resolvedName,
      customerEmail: email?.trim() || `${resolvedName.toLowerCase()}@nhn.com`,
      address: '',
      phone: '',
      notes: '',
    })
    setCurrentView(role === 'admin' ? 'admin-insights' : 'home')
  }

  const handleSignup = ({ name, email }) => {
    setCurrentUser({
      name: name.trim(),
      email: email.trim(),
      role: 'customer',
    })
    setIsAuthenticated(true)
    setCheckoutDraft({
      customerName: name.trim(),
      customerEmail: email.trim(),
      address: '',
      phone: '',
      notes: '',
    })
    setCurrentView('home')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(defaultUser)
    setCheckoutDraft(defaultCheckoutDraft)
    setCartItems([])
    setWishlist([])
    setCurrentView('landing')

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }

  const handleToggleWishlist = (productId) => {
    setWishlist((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    )
  }

  const handleAddToCart = (productId) => {
    const product = products.find((entry) => entry.id === productId)
    setCartItems((current) => {
      const item = current.find((entry) => entry.productId === productId)

      if (item) {
        return current.map((entry) =>
          entry.productId === productId ? { ...entry, quantity: entry.quantity + 1 } : entry,
        )
      }

      return [...current, { productId, quantity: 1 }]
    })
    setToastMessage(`${product?.name ?? 'Product'} added to cart`)
  }

  const handleUpdateCartQuantity = (productId, nextQuantity) => {
    setCartItems((current) => {
      if (nextQuantity <= 0) {
        return current.filter((entry) => entry.productId !== productId)
      }

      return current.map((entry) =>
        entry.productId === productId ? { ...entry, quantity: nextQuantity } : entry,
      )
    })
  }

  const handleStartCheckout = (details) => {
    setCheckoutDraft((current) => ({ ...current, ...details }))
    setCurrentView('home-payment')
  }

  const handlePlaceOrder = ({ paymentMethod, paymentLabel, paymentDetails }) => {
    if (!cartItems.length) return

    const orderProducts = cartItems.map((item) => {
      const product = products.find((entry) => entry.id === item.productId)
      return {
        ...item,
        name: product?.name ?? 'Unknown Product',
        price: product?.price ?? 0,
      }
    })

    const total = orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const orderId = `NHN-${String(orders.length + 301).padStart(3, '0')}`

    setOrders((current) => [
      {
        id: orderId,
        customerName: checkoutDraft.customerName,
        customerEmail: checkoutDraft.customerEmail,
        address: checkoutDraft.address,
        phone: checkoutDraft.phone,
        notes: checkoutDraft.notes,
        paymentMethod,
        paymentLabel,
        paymentDetails,
        paidAt: paymentDetails?.status === 'Paid' ? paymentDetails.paidAt : '',
        status: 'Confirmed',
        createdAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        total,
        items: orderProducts,
      },
      ...current,
    ])

    setProducts((current) =>
      current.map((product) => {
        const ordered = cartItems.find((item) => item.productId === product.id)
        if (!ordered) return product
        return { ...product, stock: Math.max(product.stock - ordered.quantity, 0) }
      }),
    )

    setCartItems([])
    setCheckoutDraft((current) => ({ ...current, address: '', phone: '', notes: '' }))
    setCurrentView('home-orders')
  }

  const handleAdjustInventory = (productId, change) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, stock: Math.max(product.stock + change, 0) } : product,
      ),
    )
  }

  const handleToggleFeatured = (productId) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, featured: !product.featured } : product,
      ),
    )
  }

  const handleAddProduct = (productData) => {
    const baseVisual = products.find((product) => product.id === productData.visualSourceId) ?? products[0]
    const normalizedId = productData.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const uniqueId = `${normalizedId || 'new-product'}-${products.length + 1}`

    const newProduct = {
      id: uniqueId,
      name: productData.name.trim(),
      category: productData.category.trim(),
      price: Number(productData.price),
      originalPrice: Number(productData.originalPrice || productData.price),
      size: productData.size.trim(),
      rating: 4.6,
      reviews: 0,
      stock: Number(productData.stock),
      featured: false,
      published: false,
      badge: 'New Arrival',
      image: baseVisual?.image ?? products[0]?.image,
      shortDescription: productData.shortDescription.trim(),
      description: productData.description.trim(),
      benefits: [
        productData.benefitOne.trim(),
        productData.benefitTwo.trim(),
        productData.benefitThree.trim(),
      ].filter(Boolean),
    }

    setProducts((current) => [newProduct, ...current])
    setToastMessage(`${newProduct.name} added as draft`)
  }

  const handleTogglePublish = (productId) => {
    let nextPublished = false

    setProducts((current) =>
      current.map((product) => {
        if (product.id !== productId) return product
        nextPublished = !product.published
        return { ...product, published: nextPublished }
      }),
    )

    setToastMessage(nextPublished ? 'Product published for customers' : 'Product moved back to draft')
  }

  const handleUpdateOrderStatus = (orderId, status) => {
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, status } : order)),
    )
  }

  const handleCancelOrder = (orderId) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId && ['Confirmed', 'Packed'].includes(order.status)
          ? { ...order, status: 'Cancelled' }
          : order,
      ),
    )
    setToastMessage(`Order ${orderId} cancelled`)
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const storefrontProducts = products.filter((product) => product.published)

  useEffect(() => {
    if (!toastMessage) return undefined

    const timer = setTimeout(() => {
      setToastMessage('')
    }, 2200)

    return () => clearTimeout(timer)
  }, [toastMessage])

  useEffect(() => {
    if (!isAuthenticated && (customerRoutes.has(currentView) || adminRoutes.has(currentView))) {
      setCurrentView('landing')
      return
    }

    if (isAuthenticated && currentUser.role === 'customer' && adminRoutes.has(currentView)) {
      setCurrentView('home')
      return
    }

    if (isAuthenticated && currentUser.role === 'admin' && customerRoutes.has(currentView)) {
      setCurrentView('admin-insights')
    }
  }, [currentView, currentUser.role, isAuthenticated])

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentView,
        currentUser,
        isAuthenticated,
        products,
        cartItems,
        wishlist,
        orders,
        checkoutDraft,
      }),
    )
  }, [currentView, currentUser, isAuthenticated, products, cartItems, wishlist, orders, checkoutDraft])

  return (
    <div className="app-shell">
      {(currentView === 'landing' ||
        currentView === 'landing-collections' ||
        currentView === 'landing-story' ||
        currentView === 'landing-contact') && (
        <LandingPage
          activeSection={getLandingSection()}
          products={storefrontProducts}
          onNavigate={navigate}
          onLoginClick={() => navigate('login')}
          onSignupClick={() => navigate('signup')}
          isAuthenticated={isAuthenticated && currentUser.role === 'customer'}
        />
      )}

      {currentView === 'login' && (
        <LoginPage
          onBack={() => navigate('landing')}
          onLogin={handleLogin}
          onSignupLink={() => navigate('signup')}
          onNavigate={navigate}
        />
      )}

      {currentView === 'signup' && (
        <SignupPage
          onBack={() => navigate('landing')}
          onSignup={handleSignup}
          onLoginLink={() => navigate('login')}
          onNavigate={navigate}
        />
      )}

      {(currentView === 'home' ||
        currentView === 'home-collections' ||
        currentView === 'home-brand' ||
        currentView === 'home-care') &&
        isAuthenticated &&
        currentUser.role === 'customer' && (
        <HomePage
          activeSection={getHomeSection()}
          user={currentUser}
          products={storefrontProducts}
          cartItems={cartItems}
          wishlist={wishlist}
          orders={orders}
          cartCount={cartCount}
          onLogout={handleLogout}
          onNavigate={navigate}
          onOpenAdmin={handleAdminEntry}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onUpdateCartQuantity={handleUpdateCartQuantity}
          onOpenCart={() => navigate('home-cart')}
          onOpenOrders={() => navigate('home-orders')}
        />
      )}

      {currentView === 'home-cart' && isAuthenticated && currentUser.role === 'customer' && (
        <CartPage
          user={currentUser}
          products={storefrontProducts}
          cartItems={cartItems}
          checkoutDraft={checkoutDraft}
          cartCount={cartCount}
          orders={orders}
          onLogout={handleLogout}
          onNavigate={navigate}
          onOpenAdmin={handleAdminEntry}
          onUpdateCartQuantity={handleUpdateCartQuantity}
          onStartCheckout={handleStartCheckout}
        />
      )}

      {currentView === 'home-orders' && isAuthenticated && currentUser.role === 'customer' && (
        <OrdersPage
          user={currentUser}
          orders={orders}
          cartCount={cartCount}
          onLogout={handleLogout}
          onNavigate={navigate}
          onOpenAdmin={handleAdminEntry}
          onCancelOrder={handleCancelOrder}
        />
      )}

      {currentView === 'home-payment' && isAuthenticated && currentUser.role === 'customer' && (
        <PaymentPage
          user={currentUser}
          products={storefrontProducts}
          cartItems={cartItems}
          checkoutDraft={checkoutDraft}
          cartCount={cartCount}
          orders={orders}
          onLogout={handleLogout}
          onNavigate={navigate}
          onOpenAdmin={handleAdminEntry}
          onBackToCart={() => navigate('home-cart')}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {adminRoutes.has(currentView) && isAuthenticated && currentUser.role === 'admin' && (
        <AdminPanel
          activeSection={getAdminSection()}
          user={currentUser}
          products={products}
          orders={orders}
          onLogout={handleLogout}
          onNavigate={navigate}
          onOpenStore={() => navigate('home')}
          onAdjustInventory={handleAdjustInventory}
          onToggleFeatured={handleToggleFeatured}
          onAddProduct={handleAddProduct}
          onTogglePublish={handleTogglePublish}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {toastMessage && <div className="app-toast">{toastMessage}</div>}
    </div>
  )
}

export default App
