import { useEffect, useMemo, useState } from 'react'
import StoreNavbar from '../../components/store-navbar/StoreNavbar'
import InfoSection from '../../components/info-section/InfoSection'
import SiteFooter from '../../components/site-footer/SiteFooter'
import { categoryOptions } from '../../data/catalog'
import './HomePage.css'

const aboutItems = [
  { title: 'Farm-Led Sourcing', description: 'Traceable procurement and freshness-focused processing for every spice batch.' },
  { title: 'Single-Vendor Trust', description: 'One brand, one quality standard, and one seamless customer care experience.' },
  { title: 'Retail-Ready Packaging', description: 'Premium packs designed for modern kitchens and shelves.' },
]

const contactItems = [
  { title: 'Customer Care Desk', description: 'Fast support for delivery updates, returns, and product guidance.' },
  { title: 'Bulk Purchase Support', description: 'Business assistance for retailers, cafes, gifting, and institutional orders.' },
  { title: 'Brand Partnerships', description: 'Connect with NHN for collaborations, events, and premium spice curation.' },
]

function HomePage({
  activeSection = 'home',
  user,
  products,
  cartItems,
  wishlist,
  orders,
  cartCount,
  onLogout,
  onNavigate,
  onOpenAdmin,
  onAddToCart,
  onToggleWishlist,
  onUpdateCartQuantity,
  onOpenCart,
  onOpenOrders,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? null)

  useEffect(() => {
    if (!products.find((product) => product.id === selectedProductId)) {
      setSelectedProductId(products[0]?.id ?? null)
    }
  }, [products, selectedProductId])

  const cartDetails = useMemo(
    () =>
      cartItems.map((item) => {
        const product = products.find((entry) => entry.id === item.productId)
        return {
          ...item,
          product,
          subtotal: (product?.price ?? 0) * item.quantity,
        }
      }),
    [cartItems, products],
  )

  const cartSubtotal = cartDetails.reduce((sum, item) => sum + item.subtotal, 0)
  const shippingCharge = cartSubtotal > 0 ? 90 : 0
  const grandTotal = cartSubtotal + shippingCharge

  const filteredProducts = useMemo(() => {
    const base = products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const query = searchTerm.trim().toLowerCase()
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })

    const sorted = [...base]

    if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price)
    if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'newest') sorted.sort((a, b) => Number(b.featured) - Number(a.featured))
    if (sortBy === 'featured') sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)

    return sorted
  }, [products, searchTerm, selectedCategory, sortBy])

  const featuredProducts = products.filter((product) => product.featured)
  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? filteredProducts[0] ?? products[0]

  const renderCatalog = () => (
    <section className="home-page__catalog">
      <div className="home-page__catalog-top">
        <div>
          <span className="home-page__eyebrow">Spice Marketplace</span>
          <h2>Browse premium packs, refined blends, and daily kitchen essentials.</h2>
        </div>
        <p>Search by product, filter by collection, and sort your selection before adding items to the cart.</p>
      </div>

      <div className="home-page__toolbar">
        <input
          type="search"
          className="home-page__search"
          placeholder="Search spices, blends, and premium collections"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="featured">Sort: Featured</option>
          <option value="price-low">Sort: Price Low to High</option>
          <option value="price-high">Sort: Price High to Low</option>
          <option value="rating">Sort: Highest Rated</option>
          <option value="newest">Sort: Trending</option>
        </select>
      </div>

      <div className="home-page__chips">
        {categoryOptions.map((category) => (
          <button
            key={category}
            type="button"
            className={`home-page__chip ${selectedCategory === category ? 'home-page__chip--active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="home-page__catalog-layout">
        <div className="home-page__grid">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id)

            return (
              <article key={product.id} className="home-page__product-card">
                <div className="home-page__product-media">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="home-page__product-content">
                  <div className="home-page__product-topline">
                    <span>{product.badge}</span>
                    <button type="button" onClick={() => onToggleWishlist(product.id)}>
                      {isWishlisted ? 'Saved' : 'Wishlist'}
                    </button>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.shortDescription}</p>
                  <div className="home-page__product-meta">
                    <strong>Rs {product.price}</strong>
                    <span>{product.size}</span>
                    <span>{product.rating} / 5</span>
                  </div>
                  <div className="home-page__product-actions">
                    <button type="button" onClick={() => setSelectedProductId(product.id)}>
                      View Details
                    </button>
                    <button type="button" className="home-page__primary-button" onClick={() => onAddToCart(product.id)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {selectedProduct && (
          <aside className="home-page__detail-card">
            <div className="home-page__detail-image">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>
            <span>{selectedProduct.category}</span>
            <h3>{selectedProduct.name}</h3>
            <p>{selectedProduct.description}</p>
            <div className="home-page__detail-price">
              <strong>Rs {selectedProduct.price}</strong>
              <small>MRP Rs {selectedProduct.originalPrice}</small>
            </div>
            <ul>
              {selectedProduct.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
            <div className="home-page__detail-actions">
              <button type="button" className="home-page__primary-button" onClick={() => onAddToCart(selectedProduct.id)}>
                Add to Cart
              </button>
              <button type="button" onClick={() => onToggleWishlist(selectedProduct.id)}>
                {wishlist.includes(selectedProduct.id) ? 'Remove Wishlist' : 'Save to Wishlist'}
              </button>
            </div>
          </aside>
        )}
      </div>
    </section>
  )

  const renderCartAndOrders = () => (
    <section className="home-page__commerce">
      <div className="home-page__cart-panel">
        <div className="home-page__panel-heading">
          <div>
            <span>Cart & Checkout</span>
            <h3>Review your selected spices and complete the order.</h3>
          </div>
          <strong>{cartItems.length} items</strong>
        </div>

        <div className="home-page__cart-list">
          {cartDetails.length === 0 && <p className="home-page__empty">Your cart is empty. Add products to start checkout.</p>}
          {cartDetails.map(({ product, quantity, subtotal }) => (
            <article key={product?.id} className="home-page__cart-item">
              <img src={product?.image} alt={product?.name} />
              <div>
                <strong>{product?.name}</strong>
                <p>{product?.size}</p>
                <div className="home-page__qty">
                  <button type="button" onClick={() => onUpdateCartQuantity(product.id, quantity - 1)}>-</button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => onUpdateCartQuantity(product.id, quantity + 1)}>+</button>
                </div>
              </div>
              <strong>Rs {subtotal}</strong>
            </article>
          ))}
        </div>

        <div className="home-page__totals">
          <div><span>Subtotal</span><strong>Rs {cartSubtotal}</strong></div>
          <div><span>Shipping</span><strong>Rs {shippingCharge}</strong></div>
          <div className="home-page__totals-grand"><span>Total</span><strong>Rs {grandTotal}</strong></div>
        </div>

        <div className="home-page__checkout home-page__checkout-preview">
          <p>Continue to the dedicated cart page to review quantities and move into secure payment.</p>
          <button type="button" className="home-page__primary-button" disabled={!cartDetails.length} onClick={onOpenCart}>
            Go to Cart
          </button>
        </div>
      </div>

      <div className="home-page__orders-panel">
        <div className="home-page__panel-heading">
          <div>
            <span>Order History</span>
            <h3>Track recent orders placed from this customer account.</h3>
          </div>
        </div>

        <div className="home-page__orders-list">
          {orders.length === 0 && <p className="home-page__empty">No orders yet. Your completed checkout will appear here.</p>}
          {orders.map((order) => (
            <article key={order.id} className="home-page__order-card">
              <div className="home-page__order-head">
                <div>
                  <strong>{order.id}</strong>
                  <p>{order.createdAt}</p>
                </div>
                <span>{order.status}</span>
              </div>
              <p>{order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}</p>
              <strong>Order Total: Rs {order.total}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  )

  const renderCustomerCare = () => (
    <>
      <section className="home-page__care-panel">
        <div className="home-page__panel-heading">
          <div>
            <span>Customer Care</span>
            <h3>Support, order help, and after-purchase assistance in one place.</h3>
          </div>
        </div>

        <div className="home-page__care-grid">
          <article className="home-page__care-card">
            <strong>Order Support</strong>
            <p>Need help with dispatch, delivery timing, address corrections, or order updates? Our support desk is ready to help.</p>
          </article>
          <article className="home-page__care-card">
            <strong>Wholesale Assistance</strong>
            <p>Retailers, cafes, gifting teams, and institutional buyers can contact NHN for larger orders and supply planning.</p>
          </article>
          <article className="home-page__care-card">
            <strong>Care Contacts</strong>
            <p>Email: support@nhnspices.com</p>
            <p>Phone: +91 90000 45678</p>
            <p>Hours: Mon - Sat, 9:00 AM - 7:00 PM</p>
          </article>
        </div>
      </section>

      <section className="home-page__orders-panel">
        <div className="home-page__panel-heading">
          <div>
            <span>Order History</span>
            <h3>Track recent orders placed from this customer account.</h3>
          </div>
        </div>

        <div className="home-page__orders-list">
          {orders.length === 0 && <p className="home-page__empty">No orders yet. Completed purchases will appear here.</p>}
          {orders.map((order) => (
            <article key={order.id} className="home-page__order-card">
              <div className="home-page__order-head">
                <div>
                  <strong>{order.id}</strong>
                  <p>{order.createdAt}</p>
                </div>
                <span>{order.status}</span>
              </div>
              <p>{order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}</p>
              <strong>Order Total: Rs {order.total}</strong>
            </article>
          ))}
        </div>
      </section>

      <InfoSection
        id="contact"
        label="Customer Care"
        title="Support, order help, and partnership access in one place."
        description="From delivery concerns to large-volume buying, the care experience stays clear and responsive."
        items={contactItems}
      />
    </>
  )

  const renderWishlist = () => {
    const wishlistProducts = products.filter((product) => wishlist.includes(product.id))

    return (
      <section className="home-page__wishlist">
        <div className="home-page__panel-heading">
          <div>
            <span>Wishlist</span>
            <h3>Saved spice picks for later purchase.</h3>
          </div>
        </div>
        <div className="home-page__wishlist-list">
          {wishlistProducts.length === 0 && <p className="home-page__empty">Save products from the catalog to build your wishlist.</p>}
          {wishlistProducts.map((product) => (
            <article key={product.id} className="home-page__wishlist-card">
              <img src={product.image} alt={product.name} />
              <div>
                <strong>{product.name}</strong>
                <p>{product.shortDescription}</p>
              </div>
              <button type="button" className="home-page__primary-button" onClick={() => onAddToCart(product.id)}>
                Add
              </button>
            </article>
          ))}
        </div>
      </section>
    )
  }

  const renderHomeDashboard = () => (
    <>
      <section className="home-page__hero">
        <div>
          <span>Welcome {user.name}</span>
          <h1>Shop premium spices with a polished, full-featured NHN marketplace.</h1>
          <p>
            Search collections, save favorites, manage your cart, place orders, and discover visually rich spice packs
            designed for a premium ecommerce experience.
          </p>
          <div className="home-page__hero-actions">
            <button type="button" className="home-page__primary-button" onClick={() => onNavigate('home-collections')}>
              Shop Collection
            </button>
            <button type="button" onClick={onOpenCart}>
              View Cart
            </button>
          </div>
        </div>

        <div className="home-page__hero-summary">
          <article>
            <strong>{products.length}</strong>
            <span>Active products</span>
          </article>
          <article>
            <strong>{wishlist.length}</strong>
            <span>Wishlist saves</span>
          </article>
          <article>
            <strong>{orders.length}</strong>
            <span>Orders placed</span>
          </article>
        </div>
      </section>

      <section className="home-page__featured">
        <div className="home-page__panel-heading">
          <div>
            <span>Featured Collection</span>
            <h3>Premium spotlight products for modern spice shopping.</h3>
          </div>
        </div>
        <div className="home-page__featured-list">
          {featuredProducts.map((product) => (
            <article key={product.id} className="home-page__featured-card" onClick={() => setSelectedProductId(product.id)}>
              <img src={product.image} alt={product.name} />
              <div>
                <strong>{product.name}</strong>
                <p>{product.shortDescription}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {renderCatalog()}
      {renderWishlist()}
      {renderCartAndOrders()}

      <InfoSection
        id="about"
        label="About the Brand"
        title="NEHA HEALTHY NATURALS combines elevated presentation with a dependable single-vendor shopping experience."
        description="The storefront is designed to feel premium while still making browsing, ordering, and repeat purchasing easy."
        items={aboutItems}
        accent="earth"
      />

      <InfoSection
        id="contact"
        label="Customer Care"
        title="Support, order help, and wholesale partnerships remain visible across the store journey."
        description="Customers and business buyers can connect with one professional support system."
        items={contactItems}
      />
    </>
  )

  const renderContent = () => {
    if (activeSection === 'collections') return renderCatalog()
    if (activeSection === 'brand') {
      return (
        <InfoSection
          id="about"
          label="About the Brand"
          title="A single-vendor spice marketplace built for trust, quality, and elevated digital merchandising."
          description="NHN pairs authentic sourcing with a premium ecommerce presentation for daily shoppers and bulk buyers."
          items={aboutItems}
          accent="earth"
        />
      )
    }

    if (activeSection === 'care') {
      return renderCustomerCare()
    }

    return renderHomeDashboard()
  }

  return (
    <main className="home-page">
      <div className="home-page__container">
        <StoreNavbar
          user={user}
          cartCount={cartCount}
          orderCount={orders.length}
          showSecondaryAction={false}
          onLogout={onLogout}
          onNavigate={onNavigate}
          onOpenAdmin={onOpenAdmin}
          secondaryActionLabel="Admin Panel"
        />
        {renderContent()}
        <SiteFooter onNavigate={onNavigate} footerRoutePrefix="home" />
      </div>
    </main>
  )
}

export default HomePage
