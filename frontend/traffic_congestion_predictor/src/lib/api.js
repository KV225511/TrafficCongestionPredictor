const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

class ApiClient {
  getToken() {
    return localStorage.getItem("auth_token");
  }

  async request(endpoint, options = {}) {
    const { requiresAuth = false, headers: customHeaders, ...rest } = options;

    const headers = {
      "Content-Type": "application/json",
      ...(customHeaders || {}),
    };

    if (requiresAuth) {
      const token = this.getToken();
      if (token) {
        headers["Authorization"] = `Token ${token}`;
      }
    }

    let response;
    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
        ...rest,
      });
    } catch (err) {
      throw new Error(
        `Network error: cannot reach backend at ${API_BASE_URL}. Is the server running?`
      );
    }

    if (response.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = "/";
      throw new Error("Unauthorized");
    }

    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(response.ok ? "Invalid response" : `Server error (${response.status})`);
    }

    if (!response.ok) {
      const msg = data.error || data.detail || (data.details && JSON.stringify(data.details)) || "Request failed";
      throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }

    return data;
  }

  async login(username, password) {
    return this.request("/user_auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async register(username, email, password) {
    return this.request("/user_auth/signup/", {
      method: "POST",
      body: JSON.stringify({ username, password, email }),
    });
  }

  async logout() {
    return this.request("/user_auth/logout/", {
      method: "POST",
      requiresAuth: true,
    });
  }

  async predict(start, end, depart_at) {
    return this.request("/api/predict/", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify({ start, end, depart_at }),
    });
  }

  async getHistory() {
    return this.request("/api/history/get_history/", {
      method: "GET",
      requiresAuth: true,
    });
  }
}

export const api = new ApiClient();
