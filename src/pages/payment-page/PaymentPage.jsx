import StoreNavbar from '../../components/store-navbar/StoreNavbar'
import SiteFooter from '../../components/site-footer/SiteFooter'
import './PaymentPage.css'

const upiApps = [
  { id: 'gpay', label: 'Google Pay' },
  { id: 'phonepe', label: 'PhonePe' },
  { id: 'paytm', label: 'Paytm' },
  { id: 'bhim', label: 'BHIM UPI' },
]

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
  const paymentMethod = 'upi'
  const paymentDetails = {
    upiApp: 'gpay',
    upiId: 'neha.customer@okaxis',
  }

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
  const merchantUpiId = 'payments.nhn@oksbi'
  const merchantName = 'Neha Healthy Naturals'
  const selectedUpiApp = upiApps.find((app) => app.id === paymentDetails.upiApp)
  const upiLink = `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(
    merchantName,
  )}&am=${total}&cu=INR&tn=${encodeURIComponent(`NHN order payment by ${checkoutDraft.customerName}`)}`

  const handlePayment = (event) => {
    event.preventDefault()
    const formValues = Object.fromEntries(new FormData(event.currentTarget).entries())

    const paidAt = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    const transactionId = `PAY-${Date.now()}`

    onPlaceOrder?.({
      paymentMethod,
      paymentLabel: `UPI • ${selectedUpiApp?.label ?? 'UPI'}`,
      paymentDetails: {
        status: 'Paid',
        amount: total,
        app: selectedUpiApp?.label ?? 'UPI',
        upiId: formValues.upiId || paymentDetails.upiId,
        merchantUpiId,
        transactionId,
        paidAt,
      },
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
                    <p>
                      {quantity} x Rs {product?.price}
                    </p>
                  </div>
                  <strong>Rs {lineTotal}</strong>
                </article>
              ))}
            </div>

            <div className="payment-page__totals">
              <div>
                <span>Subtotal</span>
                <strong>Rs {subtotal}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <strong>Rs {shipping}</strong>
              </div>
              <div className="payment-page__totals-grand">
                <span>Total</span>
                <strong>Rs {total}</strong>
              </div>
            </div>
          </div>

          <form className="payment-page__panel payment-page__form" onSubmit={handlePayment}>
            <div className="payment-page__heading">
              <h2>Payment Method</h2>
            </div>

            <div className="payment-page__method-switch">
              <button type="button" className="payment-page__method-button payment-page__method-button--active">
                UPI
              </button>
              <button type="button" className="payment-page__method-button">
                Card
              </button>
            </div>

            <div className="payment-page__upi-block">
              <select name="upiApp" defaultValue={paymentDetails.upiApp} required>
                {upiApps.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.label}
                  </option>
                ))}
              </select>
              <input
                name="upiId"
                defaultValue={paymentDetails.upiId}
                placeholder="Enter your UPI ID"
                required
              />
              <div className="payment-page__request-card">
                <strong>UPI App Request</strong>
                <p>
                  Use {selectedUpiApp?.label} to pay Rs {total} to {merchantName}.
                </p>
                <small>Merchant UPI ID: {merchantUpiId}</small>
                <div className="payment-page__request-actions">
                  <a className="payment-page__upi-link" href={upiLink}>
                    Open {selectedUpiApp?.label}
                  </a>
                </div>
                <small>
                  Real collect requests need backend gateway integration. This app opens the selected UPI app with the
                  payment amount and merchant details already filled in.
                </small>
              </div>
            </div>

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
