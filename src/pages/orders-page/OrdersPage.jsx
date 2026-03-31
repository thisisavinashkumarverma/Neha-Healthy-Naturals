import StoreNavbar from '../../components/store-navbar/StoreNavbar'
import SiteFooter from '../../components/site-footer/SiteFooter'
import './OrdersPage.css'

function OrdersPage({ user, orders, cartCount, onLogout, onNavigate, onOpenAdmin, onCancelOrder }) {
  const canCancel = (status) => ['Confirmed', 'Packed'].includes(status)

  return (
    <main className="orders-page">
      <div className="orders-page__container">
        <StoreNavbar
          user={user}
          cartCount={cartCount}
          orderCount={orders.length}
          onLogout={onLogout}
          onNavigate={onNavigate}
          onOpenAdmin={onOpenAdmin}
          secondaryActionLabel="Admin Panel"
        />

        <section className="orders-page__hero">
          <div>
            <span>My Orders</span>
            <h1>Track every order placed from your NHN account.</h1>
            <p>Review product details, payment information, delivery progress, and cancel eligible orders from one place.</p>
          </div>
          <button type="button" className="orders-page__ghost-button" onClick={() => onNavigate('home-collections')}>
            Shop More
          </button>
        </section>

        <section className="orders-page__list">
          {orders.length === 0 && (
            <div className="orders-page__empty">
              <h2>No orders yet</h2>
              <p>Your completed purchases will appear here with live status and cancellation controls where available.</p>
            </div>
          )}

          {orders.map((order) => (
            <article key={order.id} className="orders-page__card">
              <div className="orders-page__head">
                <div>
                  <span>{order.id}</span>
                  <h2>{order.createdAt}</h2>
                </div>
                <div className="orders-page__status-group">
                  <strong className={`orders-page__status orders-page__status--${order.status.toLowerCase()}`}>{order.status}</strong>
                  <small>{order.paymentLabel}</small>
                </div>
              </div>

              <div className="orders-page__meta">
                <div>
                  <strong>Delivery To</strong>
                  <p>{order.customerName}</p>
                  <p>{order.address}</p>
                </div>
                <div>
                  <strong>Contact</strong>
                  <p>{order.customerEmail}</p>
                  <p>{order.phone}</p>
                </div>
                <div>
                  <strong>Total</strong>
                  <p>Rs {order.total}</p>
                  {order.notes && <p>Note: {order.notes}</p>}
                </div>
              </div>

              <div className="orders-page__items">
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.productId}`} className="orders-page__item">
                    <strong>{item.name}</strong>
                    <span>{item.quantity} x Rs {item.price}</span>
                  </div>
                ))}
              </div>

              <div className="orders-page__actions">
                <button type="button" className="orders-page__secondary-button" onClick={() => onNavigate('home-care')}>
                  Contact Support
                </button>
                {canCancel(order.status) ? (
                  <button type="button" className="orders-page__danger-button" onClick={() => onCancelOrder(order.id)}>
                    Cancel Order
                  </button>
                ) : (
                  <button type="button" className="orders-page__disabled-button" disabled>
                    Cancellation Unavailable
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>

        <SiteFooter onNavigate={onNavigate} footerRoutePrefix="home" />
      </div>
    </main>
  )
}

export default OrdersPage
