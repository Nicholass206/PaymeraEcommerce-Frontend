import type {
  AuthResponse,
  ProductsResponse,
  ProductResponse,
  CartResponse,
  CartActionResponse,
  PaymentCreateRequest,
  PaymentCreateResponse,
  PaymentStatusResponse,
} from "@/types";

const API_BASE_URL = "http://127.0.0.1:8001/api";

class ApiService {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("paymera_token");
  }

  private setToken(token: string): void {
    localStorage.setItem("paymera_token", token);
  }

  private removeToken(): void {
    localStorage.removeItem("paymera_token");
  }

  private getUser(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("paymera_user");
  }

  setUser(user: { id: number; name: string; email: string }): void {
    localStorage.setItem("paymera_user", JSON.stringify(user));
  }

  removeUser(): void {
    localStorage.removeItem("paymera_user");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setToken(response.token);
    this.setUser(response.user);
    return response;
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        device_name: "frontend-web",
      }),
    });
    this.setToken(response.token);
    this.setUser(response.user);
    return response;
  }

  async logout(): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>("/auth/logout", {
      method: "POST",
    });
    this.removeToken();
    this.removeUser();
    return response;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): { id: number; name: string; email: string } | null {
    const user = this.getUser();
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  // Product endpoints
  async getProducts(page?: number): Promise<ProductsResponse> {
    const query = page ? `?page=${page}` : "";
    return this.request<ProductsResponse>(`/products${query}`);
  }

  async getProduct(id: number): Promise<ProductResponse> {
    return this.request<ProductResponse>(`/products/${id}`);
  }

  // Cart endpoints
  async getCart(): Promise<CartResponse> {
    return this.request<CartResponse>("/cart");
  }

  async addToCart(productId: number, quantity: number): Promise<CartActionResponse> {
    return this.request<CartActionResponse>("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        product_id: productId,
        quantity,
      }),
    });
  }

  async updateCartItem(itemId: number, quantity: number): Promise<CartActionResponse> {
    return this.request<CartActionResponse>(`/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: number): Promise<CartActionResponse> {
    return this.request<CartActionResponse>(`/cart/items/${itemId}`, {
      method: "DELETE",
    });
  }

  // Payment endpoints
  async createPayment(data: PaymentCreateRequest): Promise<PaymentCreateResponse> {
    return this.request<PaymentCreateResponse>("/payments/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    return this.request<PaymentStatusResponse>(`/payments/status/${paymentId}`);
  }
}

export const api = new ApiService();
