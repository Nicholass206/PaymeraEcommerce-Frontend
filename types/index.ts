// User types
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  token_type: string;
  user: User;
}

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  image?: string;
}

export interface ProductsResponse {
  data: Product[];
  links?: {
    first?: string;
    last?: string;
    prev?: string | null;
    next?: string | null;
  };
  meta?: {
    current_page?: number;
    from?: number;
    last_page?: number;
    path?: string;
    per_page?: number;
    to?: number;
    total?: number;
  };
}

export interface ProductResponse {
  data: Product;
}

// Cart types
export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
}

export interface CartResponse {
  data: Cart;
}

export interface CartActionResponse {
  message: string;
  cart: Cart;
}

// Payment types
export interface PaymentCreateRequest {
  lang: string;
  amount: number;
  callbackURL: string;
  triggerURL: string;
  notes?: string;
}

export interface PaymentCreateResponse {
  ErrorMessage: string;
  ErrorCode: number;
  Data: {
    url: string;
    paymentId: string;
  };
}

export interface PaymentStatusResponse {
  ErrorMessage: string;
  ErrorCode: number;
  Data: {
    status: string;
    creationTimestamp: string;
    rrn: string | null;
    amount: string;
    terminalId: string;
    notes: string;
    callbackURL: string;
    triggerURL: string;
  };
}

// API Error
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
