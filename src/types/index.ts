// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'kasir' | 'waiter';
  created_at: number;
  updated_at: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'kasir' | 'waiter';
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Category Types
export interface Category {
  id: string;
  name: string;
}

// Menu Types
export interface Menu {
  id: string;
  name: string;
  description: string;
  category_id: string;
  category: Category;
  price: number;
  stock: number;
  image_url: string;
  is_available: boolean;
  created_at: number;
  updated_at: number;
}

export interface CreateMenuRequest {
  name: string;
  description?: string;
  category_id: string;
  price: number;
  stock: number;
  is_available?: boolean;
}

export interface UpdateMenuRequest {
  name?: string;
  description?: string;
  category_id?: string;
  price?: number;
  stock?: number;
  is_available?: boolean;
}

// Table Types
export interface Table {
  id: string;
  table_number: number;
  barcode_url: string;
  status: 'available' | 'occupied';
  created_at: number;
  updated_at: number;
}

export interface CreateTableRequest {
  table_number: number;
}

export interface UpdateTableRequest {
  table_number?: number;
  status?: 'available' | 'occupied';
}

// Order Types
export interface OrderItem {
  id: string;
  order_id: string;
  menu_id: string;
  menu: Menu;
  quantity: number;
  subtotal: number;
  notes?: string;
}

export interface Order {
  id: string;
  table_id: string;
  table: Table;
  user_id?: string;
  user?: User;
  total: number;
  status: 'pending' | 'paid' | 'cooking' | 'done' | 'cancelled';
  notes: string;
  order_items: OrderItem[];
  created_at: number;
  updated_at: number;
}

export interface CreateOrderRequest {
  table_id: string;
  notes?: string;
  items: {
    menu_id: string;
    quantity: number;
    notes?: string;
  }[];
}

export interface UpdateOrderStatusRequest {
  status: 'pending' | 'paid' | 'cooking' | 'done' | 'cancelled';
}

// Payment Types
export interface Payment {
  id: string;
  order_id: string;
  payment_method: string;
  status: string;
  amount: number;
  snap_token: string;
  snap_redirect_url: string;
  created_at: number;
  updated_at: number;
}

// Report Types
export interface DailySalesReport {
  date: string;
  total_orders: number;
  total_revenue: number;
  orders_by_status: Record<string, number>;
}

export interface MonthlySalesReport {
  year: number;
  month: number;
  total_orders: number;
  total_revenue: number;
  daily_sales: {
    date: string;
    total: number;
  }[];
}

export interface Transaction {
  id: string;
  order_id: string;
  table_number: number;
  total: number;
  status: string;
  payment_method: string;
  created_at: number;
}

// Cart Types (for frontend state)
export interface CartItem {
  menu: Menu;
  quantity: number;
  notes?: string;
}
