import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7153',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    Accept: 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Note: Jab FormData bhejte hain, toh axios khud Content-Type 'multipart/form-data' set kar leta hai.
    // Global 'application/json' hata diya gaya hai taake file upload mein conflict na ho.
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // Errors ko chupane ki bajaye console mein print karein taake asal waja pata chale
    console.error("API Error Response:", err.response || err.message);
    return Promise.reject(err)
  },
)

export default apiClient