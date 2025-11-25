import { getSession } from "next-auth/react";

// Use API_URL for server-side calls (inside Docker), NEXT_PUBLIC_API_URL for client-side
const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL || "http://localhost:8080"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  // Add auth token if required
  if (requiresAuth) {
    const session = await getSession();
    if (session?.user?.token) {
      headers["Authorization"] = `Bearer ${session.user.token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: response.statusText,
      message: "Erro ao processar requisição",
    }));
    throw new Error(error.message || "Erro na requisição");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    name?: string;
  }) => {
    return request<{
      token: string;
      user: { id: string; email: string; name: string | null };
    }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: false,
    });
  },

  login: async (data: { email: string; password: string }) => {
    return request<{
      token: string;
      user: { id: string; email: string; name: string | null };
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: false,
    });
  },

  getMe: async () => {
    return request<{ id: string; email: string; name: string | null }>(
      "/api/me"
    );
  },
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    return request<
      Array<{
        id: string;
        name: string;
        color: string;
        icon: string;
        description: string | null;
        created_at: string;
      }>
    >("/api/categories");
  },
};

// Income API
export const incomeApi = {
  set: async (data: { amount: number; month: number; year: number }) => {
    return request<{
      id: string;
      user_id: string;
      amount: number;
      month: number;
      year: number;
      created_at: string;
      updated_at: string;
    }>("/api/income", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  get: async (month: number, year: number) => {
    return request<{
      id?: string;
      user_id?: string;
      amount: number;
      month: number;
      year: number;
      created_at?: string;
      updated_at?: string;
    }>(`/api/income?month=${month}&year=${year}`);
  },
};

// Goals API
export const goalsApi = {
  set: async (data: { category_id: string; percentage: number }) => {
    return request("/api/goals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  setMultiple: async (data: {
    goals: Array<{ category_id: string; percentage: number }>;
  }) => {
    return request<{ message: string }>("/api/goals/batch", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return request<
      Array<{
        id: string;
        user_id: string;
        category_id: string;
        percentage: number;
        created_at: string;
        updated_at: string;
      }>
    >(`/api/goals`);
  },
};

// Expenses API
export const expensesApi = {
  create: async (data: {
    category_id: string;
    name: string;
    amount: number;
    month: number;
    year: number;
    description?: string;
  }) => {
    return request("/api/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getAll: async (filters?: {
    month?: number;
    year?: number;
    category_id?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.month) params.append("month", filters.month.toString());
    if (filters?.year) params.append("year", filters.year.toString());
    if (filters?.category_id) params.append("category_id", filters.category_id);

    const queryString = params.toString();
    return request<
      Array<{
        id: string;
        user_id: string;
        user_email: string;
        user_name: string | null;
        category_id: string;
        category_name: string;
        category_color: string;
        category_icon: string;
        expense_name: string;
        amount: number;
        description: string | null;
        month: number;
        year: number;
        created_at: string;
        updated_at: string;
      }>
    >(`/api/expenses${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id: string) => {
    return request(`/api/expenses/${id}`);
  },

  update: async (
    id: string,
    data: { name?: string; amount?: number; description?: string }
  ) => {
    return request(`/api/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return request(`/api/expenses/${id}`, {
      method: "DELETE",
    });
  },
};

// Budget API
export const budgetApi = {
  getSummary: async (month: number, year: number) => {
    return request<
      Array<{
        user_id: string;
        email: string;
        user_name: string | null;
        category_id: string;
        category_name: string;
        category_color: string;
        category_icon: string;
        month: number | null;
        year: number | null;
        goal_percentage: number | null;
        monthly_income: number | null;
        budget_amount: number | null;
        spent_amount: number | null;
        remaining_amount: number | null;
        used_percentage: number | null;
      }>
    >(`/api/budget/summary?month=${month}&year=${year}`);
  },
};
