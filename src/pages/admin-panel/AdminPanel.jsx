import StoreNavbar from '../../components/store-navbar/StoreNavbar'
import AdminOverview from '../../components/admin-overview/AdminOverview'
import SiteFooter from '../../components/site-footer/SiteFooter'
import './AdminPanel.css'

function AdminPanel({
  activeSection = 'insights',
  user,
  products,
  orders,
  onLogout,
  onNavigate,
  onOpenStore,
  onAdjustInventory,
  onToggleFeatured,
  onAddProduct,
  onTogglePublish,
  onUpdateOrderStatus,
}) {
  const displayUser = user.role === 'admin' ? user : { ...user, role: 'admin', name: 'Admin' }
  const adminLinks = [
    { label: 'Insights', route: 'admin-insights' },
    { label: 'New Product', route: 'admin-new-product' },
    { label: 'Inventory', route: 'admin-inventory' },
    { label: 'Orders', route: 'admin-orders' },
  ]

  return (
    <main className="admin-panel-page">
      <div className="admin-panel-page__container">
        <StoreNavbar
          user={displayUser}
          navLinks={adminLinks}
          showCartShortcut={false}
          showOrdersShortcut={false}
          onLogout={onLogout}
          onNavigate={onNavigate}
          onOpenAdmin={onOpenStore}
          secondaryActionLabel="Store Home"
        />
        <AdminOverview
          activeSection={activeSection}
          user={displayUser}
          products={products}
          orders={orders}
          onAdjustInventory={onAdjustInventory}
          onToggleFeatured={onToggleFeatured}
          onAddProduct={onAddProduct}
          onTogglePublish={onTogglePublish}
          onUpdateOrderStatus={onUpdateOrderStatus}
        />
        <SiteFooter onNavigate={onNavigate} footerRoutePrefix="home" />
      </div>
    </main>
  )
}

export default AdminPanel
