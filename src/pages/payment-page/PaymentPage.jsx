import { useMemo, useState } from 'react'
import StoreNavbar from '../../components/store-navbar/StoreNavbar'
import SiteFooter from '../../components/site-footer/SiteFooter'
import './PaymentPage.css'

function PaymentPage({
  user,
  products,
  cartItems,
  checkoutDraft,
  cartCount,
  orders = [],
  onLogout,
  onNavigate,
  onOpenAdmin,
  onBackToCart,
  onPlaceOrder,
}) {
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

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

  const subtotal = cartDetails.reduce((sum, item) => sum + item.subtotal, 0)
  const shipping = subtotal > 0 ? 90 : 0
  const total = subtotal + shipping

  const handleChange = (event) => {
    const { name, value } = event.target
    setPaymentDetails((current) => ({ ...current, [name]: value }))
  }

  const handlePayment = (event) => {
    event.preventDefault()
    const label =
      paymentMethod === 'upi'
        ? `UPI • ${paymentDetails.upiId || 'Express'}`
        : `Card • ${paymentDetails.cardNumber.slice(-4) || 'XXXX'}`

    onPlaceOrder({
      paymentMethod,
      paymentLabel: label,
    })
  }

  return (
    <main className="payment-page">
      <div className="payment-page__container">
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

        <section className="payment-page__hero">
          <div>
            <span>Payment Page</span>
            <h1>Securely complete your spice order.</h1>
            <p>The payment page is connected directly to your cart and delivery details from the previous step.</p>
          </div>
          <button type="button" className="payment-page__ghost-button" onClick={onBackToCart}>
            Back to Cart
          </button>
        </section>

        <section className="payment-page__layout">
          <div className="payment-page__panel">
            <div className="payment-page__heading">
              <h2>Delivery Summary</h2>
            </div>
            <div className="payment-page__summary-card">
              <strong>{checkoutDraft.customerName}</strong>
              <p>{checkoutDraft.customerEmail}</p>
              <p>{checkoutDraft.phone}</p>
              <p>{checkoutDraft.address}</p>
              {checkoutDraft.notes && <p>Note: {checkoutDraft.notes}</p>}
            </div>

            <div className="payment-page__order-list">
              {cartDetails.map(({ product, quantity, subtotal: lineTotal }) => (
                <article key={product?.id} className="payment-page__order-item">
                  <img src={product?.image} alt={product?.name} />
                  <div>
                    <strong>{product?.name}</strong>
                    <p>{quantity} x Rs {product?.price}</p>
                  </div>
                  <strong>Rs {lineTotal}</strong>
                </article>
              ))}
            </div>

            <div className="payment-page__totals">
              <div><span>Subtotal</span><strong>Rs {subtotal}</strong></div>
              <div><span>Shipping</span><strong>Rs {shipping}</strong></div>
              <div className="payment-page__totals-grand"><span>Total</span><strong>Rs {total}</strong></div>
            </div>
          </div>

          <form className="payment-page__panel payment-page__form" onSubmit={handlePayment}>
            <div className="payment-page__heading">
              <h2>Payment Method</h2>
            </div>

            <div className="payment-page__method-switch">
              <button
                type="button"
                className={paymentMethod === 'upi' ? 'payment-page__method-button payment-page__method-button--active' : 'payment-page__method-button'}
                onClick={() => setPaymentMethod('upi')}
              >
                UPI
              </button>
              <button
                type="button"
                className={paymentMethod === 'card' ? 'payment-page__method-button payment-page__method-button--active' : 'payment-page__method-button'}
                onClick={() => setPaymentMethod('card')}
              >
                Card
              </button>
            </div>

            {paymentMethod === 'upi' ? (
              <input
                name="upiId"
                value={paymentDetails.upiId}
                onChange={handleChange}
                placeholder="Enter UPI ID"
                required
              />
            ) : (
              <>
                <input
                  name="cardName"
                  value={paymentDetails.cardName}
                  onChange={handleChange}
                  placeholder="Name on card"
                  required
                />
                <input
                  name="cardNumber"
                  value={paymentDetails.cardNumber}
                  onChange={handleChange}
                  placeholder="Card number"
                  required
                />
                <div className="payment-page__card-row">
                  <input name="expiry" value={paymentDetails.expiry} onChange={handleChange} placeholder="MM/YY" required />
                  <input name="cvv" value={paymentDetails.cvv} onChange={handleChange} placeholder="CVV" required />
                </div>
              </>
            )}

            <button type="submit" className="payment-page__primary-button" disabled={!cartDetails.length}>
              Pay Rs {total}
            </button>
          </form>
        </section>

        <SiteFooter onNavigate={onNavigate} footerRoutePrefix="home" />
      </div>
    </main>
  )
}

export default PaymentPage
