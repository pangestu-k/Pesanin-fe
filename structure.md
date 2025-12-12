! Sekarang kita bangun struktur frontend yang:

✅ Dipisah antara Admin Panel & User (Customer/Barcode)
✅ Menggunakan Atomic Design
✅ React + Vite + TypeScript + Tailwind + Ant Design
✅ Clean, scalable, dan mudah di-maintain
✅ Siap diintegrasikan dengan backend Golang API yang sudah kita definisikan

🚀 1. STRUKTUR FRONTEND UTAMA

Kita akan memiliki 1 frontend,
tapi foldernya dipisah menjadi:

admin panel (/admin)

user barcode (/customer)

Dengan router yang berbeda.

📦 STRUKTUR FOLDER FINAL (Atomic Design + Modular Architecture)
frontend/
│
├── src/
│ ├── app/ # Routing & entry logic
│ │ ├── routes/
│ │ │ ├── admin.routes.jsx
│ │ │ ├── customer.routes.jsx
│ │ │ └── index.jsx
│ │ └── providers/
│ │ ├── AuthProvider.jsx
│ │ └── QueryProvider.jsx # React Query (opsional)
│ │
│ ├── configs/ # API Base URL, constants
│ │ └── api.js
│ │
│ ├── libs/ # External integration (axios, helpers)
│ │ ├── axios.js
│ │ ├── midtrans.js
│ │ └── storage.js
│ │
│ ├── layouts/ # Layouts (Admin, Customer)
│ │ ├── AdminLayout.jsx
│ │ ├── CustomerLayout.jsx
│ │ └── AuthLayout.jsx
│ │
│ ├── pages/ # Pages (by module)
│ │ ├── admin/
│ │ │ ├── dashboard/
│ │ │ ├── menu/
│ │ │ ├── orders/
│ │ │ ├── tables/
│ │ │ ├── reports/
│ │ │ └── users/
│ │ │
│ │ ├── customer/
│ │ │ ├── menu/
│ │ │ ├── cart/
│ │ │ ├── checkout/
│ │ │ ├── order-status/
│ │ │ └── scan/
│ │ │
│ │ └── auth/
│ │ └── Login.jsx
│ │
│ ├── components/ # Atomic design
│ │ ├── atoms/
│ │ │ ├── Button.jsx
│ │ │ ├── Input.jsx
│ │ │ ├── Icon.jsx
│ │ │ └── Text.jsx
│ │ │
│ │ ├── molecules/
│ │ │ ├── MenuCard.jsx
│ │ │ ├── OrderCard.jsx
│ │ │ ├── TableCard.jsx
│ │ │ └── Navbar.jsx
│ │ │
│ │ ├── organisms/
│ │ │ ├── MenuGrid.jsx
│ │ │ ├── CartList.jsx
│ │ │ ├── OrderList.jsx
│ │ │ ├── Sidebar.jsx
│ │ │ └── Header.jsx
│ │ │
│ │ ├── templates/
│ │ │ ├── AdminPage.jsx
│ │ │ └── CustomerPage.jsx
│ │
│ ├── hooks/ # Custom hooks
│ │ ├── useAuth.js
│ │ ├── useOrder.js
│ │ └── useMenu.js
│ │
│ ├── services/ # API services (fetch ke backend)
│ │ ├── auth.service.js
│ │ ├── menu.service.js
│ │ ├── order.service.js
│ │ ├── table.service.js
│ │ └── payment.service.js
│ │
│ ├── states/ # State mgmt (Zustand atau Redux)
│ │ ├── cart.store.js
│ │ └── user.store.js
│ │
│ ├── styles/ # CSS global, variables
│ ├── assets/ # Icons, images
│ ├── main.jsx # Root entry
│ └── index.css
│
└── package.json

⭐ PENJELASAN DESAIN FRONTEND
🧩 1. Separation of concerns

Admin panel dan customer page benar-benar dipisah:

/admin → halaman admin + kasir

/customer → halaman customer setelah scan barcode

Ini sangat maintainable dan scalable.

🧩 2. Atomic Design Implementation (REAL)
Atoms

Elemen kecil, reusable:

Button

Input

Text

Icon

Molecules

Gabungan atoms:

MenuCard

OrderCard

TableCard

Navbar

Organisms

Komponen kompleks:

MenuGrid

CartList

OrderList

Sidebar Admin

Header Admin

Templates

Kerangka halaman:

AdminPage (navbar + sidebar + content)

CustomerPage (header + content)

Pages

Implementasi spesifik:

Dashboard

List menu

Scan QR

Keranjang

Checkout

Tracking pesanan

Gunakna Axios dan juga tanstack query

🎨 DESAIN UI ADMIN PANEL (ANT DESIGN)

Fitur:

Sidebar (Menu, Orders, Tables, Reports)

Header

Dashboard chart (Ant Design Chart)

Table data (Ant Table)

Modal (Add menu, edit menu)

🎨 DESAIN CUSTOMER (VIA BARCODE)

UI sederhana dan menarik:

Grid menu (gambar + harga)

Floating cart button

Checkout → Midtrans payment redirect

Status pesanan (real-time)
