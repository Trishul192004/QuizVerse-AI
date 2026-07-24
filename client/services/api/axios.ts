import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const res = await axios.post(
            "http://localhost:5000/api/auth/refresh",
            { refreshToken }
          );

          if (res.data.success) {
            const newToken = res.data.accessToken;
            localStorage.setItem("token", newToken);
            originalRequest.headers.Authorization =
              `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;