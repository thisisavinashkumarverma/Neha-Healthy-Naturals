import { useEffect, useState } from 'react'
import { initialProducts } from '../data/catalog'
import { createCheckoutDraftForUser, defaultUser } from '../services/authservieces'

const STORAGE_KEY = 'nhn-app-state'

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

function useShopState() {
  const storedState = loadStoredState()
  const [products, setProducts] = useState(storedState?.products ?? getDefaultProducts())
  const [cartItems, setCartItems] = useState(storedState?.cartItems ?? [])
  const [wishlist, setWishlist] = useState(storedState?.wishlist ?? [])
  const [orders, setOrders] = useState(storedState?.orders ?? [])
  const [checkoutDraft, setCheckoutDraft] = useState(
    storedState?.checkoutDraft ?? createCheckoutDraftForUser(defaultUser),
  )
  const [toastMessage, setToastMessage] = useState('')

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
  }

  const handlePlaceOrder = ({ paymentMethod, paymentLabel, paymentDetails }) => {
    if (!cartItems.length) return null

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
    return orderId
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

  const resetAfterLogout = () => {
    setCheckoutDraft(createCheckoutDraftForUser(defaultUser))
    setCartItems([])
    setWishlist([])
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
    if (typeof window === 'undefined') return

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        products,
        cartItems,
        wishlist,
        orders,
        checkoutDraft,
      }),
    )
  }, [products, cartItems, wishlist, orders, checkoutDraft])

  return {
    products,
    cartItems,
    wishlist,
    orders,
    checkoutDraft,
    cartCount,
    storefrontProducts,
    toastMessage,
    setCheckoutDraft,
    handleToggleWishlist,
    handleAddToCart,
    handleUpdateCartQuantity,
    handleStartCheckout,
    handlePlaceOrder,
    handleAdjustInventory,
    handleToggleFeatured,
    handleAddProduct,
    handleTogglePublish,
    handleUpdateOrderStatus,
    handleCancelOrder,
    resetAfterLogout,
  }
}

export default useShopState
