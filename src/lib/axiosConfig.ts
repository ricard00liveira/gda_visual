import axios from "axios";

const api = axios.create({
  baseURL: "https://back.gda-app.xyz/api/",
  //baseURL: "http://localhost:8000/api/",
});

// Interceptor para adicionar o token automaticamente
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

// Interceptor para renovar o token se receber um erro 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token expirado. Tentando renovar...");

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.warn("Sem refresh token. Redirecionando para login...");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post(
          "https://back.gda-app.xyz/api/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem("token", newAccessToken);

        // Refaz a requisição original com o novo token
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(error.config);
      } catch (refreshError) {
        console.error("Erro ao renovar token:", refreshError);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
