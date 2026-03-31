import { initialProducts } from './catalog'

const customerUser = {
  name: 'Neha Customer',
  email: 'customer@nhnspices.com',
  role: 'customer',
}

const adminUser = {
  name: 'Neha Admin',
  email: 'admin@nhnspices.com',
  role: 'admin',
}

const products = initialProducts.map((product, index) => ({
  ...product,
  published: index !== initialProducts.length - 1,
}))

const storefrontProducts = products.filter((product) => product.published)

const cartItems = [
  { productId: storefrontProducts[0]?.id, quantity: 2 },
  { productId: storefrontProducts[1]?.id, quantity: 1 },
].filter((item) => item.productId)

const wishlist = storefrontProducts.slice(2, 4).map((product) => product.id)

const checkoutDraft = {
  customerName: customerUser.name,
  customerEmail: customerUser.email,
  phone: '+91 90000 45678',
  address: '24 Spice Market Road, Hyderabad, Telangana',
  notes: 'Please pack the jars safely for gifting.',
}

const orders = [
  {
    id: 'NHN-1024',
    createdAt: '31 Mar 2026, 06:45 PM',
    status: 'Confirmed',
    total: 780,
    paymentMethod: 'upi',
    paymentLabel: 'UPI • Google Pay',
    customerName: checkoutDraft.customerName,
    customerEmail: checkoutDraft.customerEmail,
    phone: checkoutDraft.phone,
    address: checkoutDraft.address,
    notes: checkoutDraft.notes,
    items: [
      {
        productId: storefrontProducts[0]?.id,
        name: storefrontProducts[0]?.name ?? 'Turmeric Gold',
        quantity: 2,
        price: storefrontProducts[0]?.price ?? 0,
      },
      {
        productId: storefrontProducts[1]?.id,
        name: storefrontProducts[1]?.name ?? 'Royal Garam Masala',
        quantity: 1,
        price: storefrontProducts[1]?.price ?? 0,
      },
    ],
    paymentDetails: {
      status: 'Paid',
      amount: 780,
      app: 'Google Pay',
      upiId: 'neha.customer@okaxis',
      merchantUpiId: 'payments.nhn@oksbi',
      transactionId: 'PAY-1024',
      paidAt: '31 Mar 2026, 06:42 PM',
    },
  },
  {
    id: 'NHN-1018',
    createdAt: '28 Mar 2026, 11:10 AM',
    status: 'Dispatched',
    total: 600,
    paymentMethod: 'card',
    paymentLabel: 'Card • 4242',
    customerName: checkoutDraft.customerName,
    customerEmail: checkoutDraft.customerEmail,
    phone: checkoutDraft.phone,
    address: checkoutDraft.address,
    notes: '',
    items: [
      {
        productId: storefrontProducts[2]?.id,
        name: storefrontProducts[2]?.name ?? 'Coriander Crush',
        quantity: 2,
        price: storefrontProducts[2]?.price ?? 0,
      },
      {
        productId: storefrontProducts[3]?.id,
        name: storefrontProducts[3]?.name ?? 'Kashmiri Chili',
        quantity: 1,
        price: storefrontProducts[3]?.price ?? 0,
      },
    ],
    paymentDetails: {
      status: 'Paid',
      amount: 600,
      app: 'Card Payment',
      last4: '4242',
      transactionId: 'PAY-1018',
      paidAt: '28 Mar 2026, 11:04 AM',
    },
  },
]

export const sampleCustomerUser = customerUser
export const sampleAdminUser = adminUser
export const sampleProducts = products
export const sampleStorefrontProducts = storefrontProducts
export const sampleCartItems = cartItems
export const sampleWishlist = wishlist
export const sampleCheckoutDraft = checkoutDraft
export const sampleOrders = orders
