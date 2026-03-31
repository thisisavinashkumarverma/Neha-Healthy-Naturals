import { useMemo, useState } from 'react'
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
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [paymentDetails, setPaymentDetails] = useState({
    upiApp: 'gpay',
    upiId: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })
  const [upiRequestSent, setUpiRequestSent] = useState(false)

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
  const merchantUpiId = 'payments.nhn@oksbi'
  const merchantName = 'Neha Healthy Naturals'
  const selectedUpiApp = upiApps.find((app) => app.id === paymentDetails.upiApp)
  const upiLink = `upi://pay?pa=${encodeURIComponent(merchantUpiId)}&pn=${encodeURIComponent(
    merchantName,
  )}&am=${total}&cu=INR&tn=${encodeURIComponent(`NHN order payment by ${checkoutDraft.customerName}`)}`

  const handleChange = (event) => {
    const { name, value } = event.target
    setPaymentDetails((current) => ({ ...current, [name]: value }))

    if (name === 'upiApp' || name === 'upiId') {
      setUpiRequestSent(false)
    }
  }

  const handleSendUpiRequest = () => {
    setUpiRequestSent(true)
  }

  const handlePayment = (event) => {
    event.preventDefault()

    const paidAt = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    const transactionId = `PAY-${Date.now()}`

    const label =
      paymentMethod === 'upi'
        ? `UPI • ${selectedUpiApp?.label ?? 'UPI'}`
        : `Card • ${paymentDetails.cardNumber.slice(-4) || 'XXXX'}`

    const paymentSummary =
      paymentMethod === 'upi'
        ? {
            status: 'Paid',
            amount: total,
            app: selectedUpiApp?.label ?? 'UPI',
            upiId: paymentDetails.upiId,
            merchantUpiId,
            transactionId,
            paidAt,
          }
        : {
            status: 'Paid',
            amount: total,
            app: 'Card Payment',
            cardHolder: paymentDetails.cardName,
            last4: paymentDetails.cardNumber.slice(-4),
            transactionId,
            paidAt,
          }

    onPlaceOrder({
      paymentMethod,
      paymentLabel: label,
      paymentDetails: paymentSummary,
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
              <button
                type="button"
                className={
                  paymentMethod === 'upi'
                    ? 'payment-page__method-button payment-page__method-button--active'
                    : 'payment-page__method-button'
                }
                onClick={() => setPaymentMethod('upi')}
              >
                UPI
              </button>
              <button
                type="button"
                className={
                  paymentMethod === 'card'
                    ? 'payment-page__method-button payment-page__method-button--active'
                    : 'payment-page__method-button'
                }
                onClick={() => setPaymentMethod('card')}
              >
                Card
              </button>
            </div>

            {paymentMethod === 'upi' ? (
              <div className="payment-page__upi-block">
                <select name="upiApp" value={paymentDetails.upiApp} onChange={handleChange} required>
                  {upiApps.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.label}
                    </option>
                  ))}
                </select>
                <input
                  name="upiId"
                  value={paymentDetails.upiId}
                  onChange={handleChange}
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
                    <button type="button" className="payment-page__ghost-button" onClick={handleSendUpiRequest}>
                      Prepare Request
                    </button>
                    {upiRequestSent && (
                      <a className="payment-page__upi-link" href={upiLink}>
                        Open {selectedUpiApp?.label}
                      </a>
                    )}
                  </div>
                  <small>
                    Real collect requests need backend gateway integration. This app opens the selected UPI app with the
                    payment amount and merchant details already filled in.
                  </small>
                </div>
              </div>
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

            <button
              type="submit"
              className="payment-page__primary-button"
              disabled={!cartDetails.length || (paymentMethod === 'upi' && !upiRequestSent)}
            >
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
