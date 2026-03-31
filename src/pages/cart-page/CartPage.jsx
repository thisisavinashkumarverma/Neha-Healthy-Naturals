import StoreNavbar from '../../components/store-navbar/StoreNavbar'
import SiteFooter from '../../components/site-footer/SiteFooter'
import './CartPage.css'

function CartPage({
  user,
  products,
  cartItems,
  checkoutDraft,
  cartCount,
  orders = [],
  onLogout,
  onNavigate,
  onOpenAdmin,
  onUpdateCartQuantity,
  onStartCheckout,
}) {
  const cartDetails = cartItems.map((item) => {
    const product = products.find((entry) => entry.id === item.productId)
    return {
      ...item,
      product,
      subtotal: (product?.price ?? 0) * item.quantity,
    }
  })

  const subtotal = cartDetails.reduce((sum, item) => sum + item.subtotal, 0)
  const shipping = subtotal > 0 ? 90 : 0
  const total = subtotal + shipping

  const handleContinue = (event) => {
    event.preventDefault()
    const details = Object.fromEntries(new FormData(event.currentTarget).entries())
    onStartCheckout?.(details)
  }

  return (
    <main className="cart-page">
      <div className="cart-page__container">
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

        <section className="cart-page__hero">
          <div>
            <span>Cart Page</span>
            <h1>Review your spice selection before moving into payment.</h1>
            <p>Update quantities, confirm delivery details, and continue into the connected payment step.</p>
          </div>
          <button type="button" className="cart-page__ghost-button" onClick={() => onNavigate('home-collections')}>
            Continue Shopping
          </button>
        </section>

        <section className="cart-page__layout">
          <div className="cart-page__panel">
            <div className="cart-page__heading">
              <h2>Cart Items</h2>
              <span>{cartItems.length} items</span>
            </div>

            <div className="cart-page__list">
              {cartDetails.length === 0 && <p className="cart-page__empty">Your cart is empty. Add products from the storefront first.</p>}
              {cartDetails.map(({ product, quantity, subtotal: lineTotal }) => (
                <article key={product?.id} className="cart-page__item">
                  <img src={product?.image} alt={product?.name} />
                  <div>
                    <strong>{product?.name}</strong>
                    <p>{product?.size}</p>
                    <div className="cart-page__qty">
                      <button type="button" onClick={() => onUpdateCartQuantity?.(product.id, quantity - 1)}>-</button>
                      <span>{quantity}</span>
                      <button type="button" onClick={() => onUpdateCartQuantity?.(product.id, quantity + 1)}>+</button>
                    </div>
                  </div>
                  <strong>Rs {lineTotal}</strong>
                </article>
              ))}
            </div>

            <div className="cart-page__summary">
              <div><span>Subtotal</span><strong>Rs {subtotal}</strong></div>
              <div><span>Shipping</span><strong>Rs {shipping}</strong></div>
              <div className="cart-page__summary-total"><span>Total</span><strong>Rs {total}</strong></div>
            </div>
          </div>

          <form className="cart-page__panel cart-page__form" onSubmit={handleContinue}>
            <div className="cart-page__heading">
              <h2>Delivery Details</h2>
              <span>Connected to payment</span>
            </div>

            <input name="customerName" defaultValue={checkoutDraft.customerName} placeholder="Customer name" required />
            <input name="customerEmail" type="email" defaultValue={checkoutDraft.customerEmail} placeholder="Email address" required />
            <input name="phone" defaultValue={checkoutDraft.phone} placeholder="Phone number" required />
            <textarea name="address" defaultValue={checkoutDraft.address} placeholder="Delivery address" rows="4" required />
            <textarea name="notes" defaultValue={checkoutDraft.notes} placeholder="Order notes (optional)" rows="3" />

            <button type="submit" className="cart-page__primary-button" disabled={!cartDetails.length}>
              Continue to Payment
            </button>
          </form>
        </section>

        <SiteFooter onNavigate={onNavigate} footerRoutePrefix="home" />
      </div>
    </main>
  )
}

export default CartPage
