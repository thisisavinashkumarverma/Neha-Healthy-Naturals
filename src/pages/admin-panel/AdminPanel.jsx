import StoreNavbar from '../../components/store-navbar/StoreNavbar'
import AdminOverview from '../../components/admin-overview/AdminOverview'
import SiteFooter from '../../components/site-footer/SiteFooter'
import './AdminPanel.css'

function AdminPanel({
  user,
  products,
  orders,
  onLogout,
  onNavigate,
  onOpenStore,
  onAdjustInventory,
  onToggleFeatured,
  onUpdateOrderStatus,
}) {
  const displayUser = user.role === 'admin' ? user : { ...user, role: 'admin', name: 'Admin' }

  return (
    <main className="admin-panel-page">
      <div className="admin-panel-page__container">
        <StoreNavbar
          user={displayUser}
          showCartShortcut={false}
          showOrdersShortcut={false}
          onLogout={onLogout}
          onNavigate={onNavigate}
          onOpenAdmin={onOpenStore}
          secondaryActionLabel="Store Home"
        />
        <AdminOverview
          user={displayUser}
          products={products}
          orders={orders}
          onAdjustInventory={onAdjustInventory}
          onToggleFeatured={onToggleFeatured}
          onUpdateOrderStatus={onUpdateOrderStatus}
        />
        <SiteFooter onNavigate={onNavigate} footerRoutePrefix="home" />
      </div>
    </main>
  )
}

export default AdminPanel
