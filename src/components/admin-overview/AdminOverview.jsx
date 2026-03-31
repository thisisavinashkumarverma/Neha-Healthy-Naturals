import './AdminOverview.css'

function AdminOverview({
  activeSection = 'insights',
  user,
  products,
  orders,
  onAdjustInventory,
  onToggleFeatured,
  onAddProduct,
  onTogglePublish,
  onUpdateOrderStatus,
}) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const lowStockCount = products.filter((product) => product.stock < 20).length
  const featuredCount = products.filter((product) => product.featured).length
  const draftCount = products.filter((product) => !product.published).length
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0)

  const metrics = [
    { label: 'Total Orders', value: String(orders.length).padStart(2, '0') },
    { label: 'Active Products', value: String(products.length).padStart(2, '0') },
    { label: 'Revenue', value: `Rs ${totalRevenue || 0}` },
    { label: 'Low Stock Alerts', value: String(lowStockCount).padStart(2, '0') },
  ]

  const statusOptions = ['Confirmed', 'Packed', 'Dispatched', 'Delivered']
  const filteredProducts = products
  const filteredOrders = orders

  const topProducts = [...products]
    .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
    .slice(0, 4)

  const lowStockProducts = products.filter((product) => product.stock < 20).slice(0, 4)

  const getStockState = (stock) => {
    if (stock < 10) return 'critical'
    if (stock < 20) return 'warning'
    return 'healthy'
  }

  const handleAddProductSubmit = (event) => {
    event.preventDefault()
    const formValues = Object.fromEntries(new FormData(event.currentTarget).entries())
    onAddProduct?.(formValues)
  }

  const showInsights = activeSection === 'insights'
  const showNewProduct = activeSection === 'new-product'
  const showInventory = activeSection === 'inventory'
  const showOrders = activeSection === 'orders'
  const showPayments = activeSection === 'payments'

  return (
    <section className="admin-overview">
      <div className="admin-overview__hero">
        <div>
          <span>Admin Panel</span>
          <h1>{user.role === 'admin' ? `Welcome ${user.name}` : 'Store Command Center'}</h1>
          <p>Run inventory, merchandising, and fulfillment from one polished single-vendor control center.</p>
        </div>
        <div className="admin-overview__highlight">
          <strong>Operations Snapshot</strong>
          <p>{featuredCount} featured live, {draftCount} drafts pending publish, and {totalUnits} total units in stock.</p>
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

      {showInsights && (
        <section className="admin-overview__workspace">
          <div className="admin-overview__workspace-card">
            <div className="admin-overview__section-head">
              <div>
                <h2>Inventory Insights</h2>
                <p>Monitor low-stock items, featured visibility, and top-performing products at a glance.</p>
              </div>
            </div>
            <div className="admin-overview__insights-grid">
              <article className="admin-overview__insight-block">
                <strong>Low Stock Watch</strong>
                {lowStockProducts.length === 0 && <p className="admin-overview__empty">No urgent low-stock alerts right now.</p>}
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="admin-overview__mini-row">
                    <span>{product.name}</span>
                    <em>{product.stock} units</em>
                  </div>
                ))}
              </article>

              <article className="admin-overview__insight-block">
                <strong>Top Product Signals</strong>
                {topProducts.map((product) => (
                  <div key={product.id} className="admin-overview__mini-row">
                    <span>{product.name}</span>
                    <em>{product.rating} / 5</em>
                  </div>
                ))}
              </article>

              <article className="admin-overview__insight-block">
                <strong>Vendor Workflow</strong>
                <ul className="admin-overview__workflow-list">
                  <li>Review stock alerts each morning and top up fast-moving essentials.</li>
                  <li>Use featured toggles to control homepage merchandising.</li>
                  <li>Move orders from confirmed to dispatched as batches are packed.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>
      )}

      {showNewProduct && (
        <section className="admin-overview__workspace">
          <div className="admin-overview__workspace-card">
            <div className="admin-overview__section-head">
              <div>
                <h2>New Product Draft</h2>
                <p>Add a new spice product to the admin inventory, then decide whether to publish it for customers.</p>
              </div>
            </div>

            <form className="admin-overview__product-form" onSubmit={handleAddProductSubmit}>
              <div className="admin-overview__form-grid">
                <input name="name" placeholder="Product name" required />
                <input name="category" placeholder="Category" required />
                <input name="price" type="number" min="1" placeholder="Selling price" required />
                <input name="originalPrice" type="number" min="1" placeholder="Original price" />
                <input name="size" placeholder="Pack size" required />
                <input name="stock" type="number" min="0" placeholder="Opening stock" required />
                <select name="visualSourceId" defaultValue={products[0]?.id ?? ''}>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      Use {product.name} visual
                    </option>
                  ))}
                </select>
                <input name="shortDescription" placeholder="Short description" required />
              </div>
              <textarea name="description" placeholder="Full product description" rows="4" required />
              <div className="admin-overview__form-grid">
                <input name="benefitOne" placeholder="Benefit one" required />
                <input name="benefitTwo" placeholder="Benefit two" required />
                <input name="benefitThree" placeholder="Benefit three" required />
              </div>
              <button type="submit" className="admin-overview__create-button">
                Save as Draft
              </button>
            </form>
          </div>
        </section>
      )}

      {showInventory && (
        <div className="admin-overview__panels admin-overview__panels--single">
          <section className="admin-overview__panel">
          <div className="admin-overview__section-head">
            <div>
              <h2>Inventory Management</h2>
              <p>Filter catalog items, review stock health, and control homepage visibility like a modern commerce admin.</p>
            </div>
          </div>
          <div className="admin-overview__toolbar">
            <input
              type="search"
              placeholder="Search products or categories"
            />
            <select defaultValue="all">
              <option value="all">All inventory</option>
              <option value="low">Low stock</option>
              <option value="healthy">Healthy stock</option>
              <option value="featured">Featured only</option>
              <option value="draft">Draft only</option>
            </select>
          </div>
          <div className="admin-overview__inventory">
            {filteredProducts.map((product) => (
              <article key={product.id} className="admin-overview__inventory-row">
                <img src={product.image} alt={product.name} />
                <div className="admin-overview__inventory-main">
                  <strong>{product.name}</strong>
                  <p>{product.category} • {product.size}</p>
                  <div className="admin-overview__badges">
                    <span className={`admin-overview__stock-badge admin-overview__stock-badge--${getStockState(product.stock)}`}>
                      {product.stock} units
                    </span>
                    {product.featured && <span className="admin-overview__featured-badge">Featured</span>}
                    <span className={`admin-overview__publish-badge ${product.published ? 'admin-overview__publish-badge--live' : 'admin-overview__publish-badge--draft'}`}>
                      {product.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="admin-overview__metric-chip">{product.rating} / 5</span>
                  </div>
                </div>
                <div className="admin-overview__inventory-actions">
                  <button type="button" onClick={() => onAdjustInventory?.(product.id, -1)}>-</button>
                  <button type="button" onClick={() => onAdjustInventory?.(product.id, 1)}>+</button>
                  <button type="button" className="admin-overview__restock-button" onClick={() => onAdjustInventory?.(product.id, 10)}>
                    +10
                  </button>
                  <button type="button" className="admin-overview__publish-toggle" onClick={() => onTogglePublish?.(product.id)}>
                    {product.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button type="button" className="admin-overview__feature-toggle" onClick={() => onToggleFeatured?.(product.id)}>
                    {product.featured ? 'Featured' : 'Feature'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        </div>
      )}

      {showOrders && (
        <div className="admin-overview__panels admin-overview__panels--single">
          <section className="admin-overview__panel">
            <div className="admin-overview__section-head">
              <div>
                <h2>Order Management</h2>
                <p>Filter incoming orders and update fulfillment progress from one operational queue.</p>
              </div>
            </div>
            <div className="admin-overview__toolbar">
              <select defaultValue="all">
                <option value="all">All orders</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-overview__orders">
              {orders.length === 0 && <p className="admin-overview__empty">Orders placed by customers will appear here.</p>}
              {filteredOrders.map((order) => (
                <div key={order.id} className="admin-overview__order-card">
                  <div className="admin-overview__order-head">
                    <div>
                      <strong>{order.id}</strong>
                      <p>{order.customerName}</p>
                    </div>
                    <span>Rs {order.total}</span>
                  </div>
                  <p>{order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}</p>
                  <div className="admin-overview__order-meta">
                    <small>{order.paymentLabel}</small>
                    <small>{order.customerEmail}</small>
                  </div>
                  <select defaultValue={order.status} onChange={(event) => onUpdateOrderStatus?.(order.id, event.target.value)}>
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
      )}

      {showPayments && (
        <div className="admin-overview__panels admin-overview__panels--single">
          <section className="admin-overview__panel">
            <div className="admin-overview__section-head">
              <div>
                <h2>Payment Details</h2>
                <p>Review who paid, how much they paid, when the payment happened, and which method or app was used.</p>
              </div>
            </div>
            <div className="admin-overview__orders">
              {orders.length === 0 && <p className="admin-overview__empty">Completed customer payments will appear here.</p>}
              {orders.map((order) => (
                <article key={`payment-${order.id}`} className="admin-overview__payment-card">
                  <div className="admin-overview__payment-head">
                    <div>
                      <strong>{order.customerName}</strong>
                      <p>{order.customerEmail}</p>
                    </div>
                    <span>Rs {order.paymentDetails?.amount ?? order.total}</span>
                  </div>
                  <div className="admin-overview__payment-grid">
                    <div>
                      <strong>Order ID</strong>
                      <p>{order.id}</p>
                    </div>
                    <div>
                      <strong>Payment Method</strong>
                      <p>{order.paymentLabel}</p>
                    </div>
                    <div>
                      <strong>Paid Via</strong>
                      <p>{order.paymentDetails?.app ?? order.paymentMethod}</p>
                    </div>
                    <div>
                      <strong>Paid On</strong>
                      <p>{order.paymentDetails?.paidAt ?? order.createdAt}</p>
                    </div>
                    <div>
                      <strong>Transaction ID</strong>
                      <p>{order.paymentDetails?.transactionId ?? 'Not available'}</p>
                    </div>
                    <div>
                      <strong>Status</strong>
                      <p>{order.paymentDetails?.status ?? 'Pending'}</p>
                    </div>
                    <div>
                      <strong>Customer UPI</strong>
                      <p>{order.paymentDetails?.upiId ?? 'Not applicable'}</p>
                    </div>
                    <div>
                      <strong>Merchant UPI</strong>
                      <p>{order.paymentDetails?.merchantUpiId ?? 'Not applicable'}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </section>
  )
}

export default AdminOverview
