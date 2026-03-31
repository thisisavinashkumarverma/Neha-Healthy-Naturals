import './AdminOverview.css'

function AdminOverview({
  user,
  products,
  orders,
  onAdjustInventory,
  onToggleFeatured,
  onUpdateOrderStatus,
}) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const lowStockCount = products.filter((product) => product.stock < 20).length

  const metrics = [
    { label: 'Total Orders', value: String(orders.length).padStart(2, '0') },
    { label: 'Active Products', value: String(products.length).padStart(2, '0') },
    { label: 'Revenue', value: `Rs ${totalRevenue || 0}` },
    { label: 'Low Stock Alerts', value: String(lowStockCount).padStart(2, '0') },
  ]

  const statusOptions = ['Confirmed', 'Packed', 'Dispatched', 'Delivered']

  return (
    <section className="admin-overview">
      <div className="admin-overview__hero">
        <div>
          <span>Admin Panel</span>
          <h1>{user.role === 'admin' ? `Welcome ${user.name}` : 'Store Command Center'}</h1>
          <p>Manage catalog performance, single-vendor inventory, and ecommerce order flow from one dashboard.</p>
        </div>
        <div className="admin-overview__highlight">
          <strong>Storefront Sync Active</strong>
          <p>Inventory updates, featured products, and order statuses are connected directly to the customer store.</p>
        </div>
      </div>

      <div className="admin-overview__metrics">
        {metrics.map((metric) => (
          <article key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>

      <div className="admin-overview__panels">
        <section className="admin-overview__panel">
          <div className="admin-overview__section-head">
            <div>
              <h2>Inventory Control</h2>
              <p>Adjust stock instantly and pin products into the featured customer collection.</p>
            </div>
          </div>
          <div className="admin-overview__inventory">
            {products.map((product) => (
              <article key={product.id} className="admin-overview__inventory-row">
                <img src={product.image} alt={product.name} />
                <div>
                  <strong>{product.name}</strong>
                  <p>{product.category}</p>
                  <span>Stock: {product.stock}</span>
                </div>
                <div className="admin-overview__inventory-actions">
                  <button type="button" onClick={() => onAdjustInventory(product.id, -1)}>-</button>
                  <button type="button" onClick={() => onAdjustInventory(product.id, 1)}>+</button>
                  <button type="button" className="admin-overview__feature-toggle" onClick={() => onToggleFeatured(product.id)}>
                    {product.featured ? 'Featured' : 'Feature'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-overview__panel">
          <div className="admin-overview__section-head">
            <div>
              <h2>Order Management</h2>
              <p>Update live customer order statuses from the vendor dashboard.</p>
            </div>
          </div>
          <div className="admin-overview__orders">
            {orders.length === 0 && <p className="admin-overview__empty">Orders placed by customers will appear here.</p>}
            {orders.map((order) => (
              <div key={order.id} className="admin-overview__order-card">
                <div className="admin-overview__order-head">
                  <div>
                    <strong>{order.id}</strong>
                    <p>{order.customerName}</p>
                  </div>
                  <span>Rs {order.total}</span>
                </div>
                <p>{order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}</p>
                <select value={order.status} onChange={(event) => onUpdateOrderStatus(order.id, event.target.value)}>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

export default AdminOverview
