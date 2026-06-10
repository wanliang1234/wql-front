import axios from 'axios'

/**
 * 1. axios.create()
 * 作用：创建一个新的 axios 实例，而不是使用全局默认的 axios 对象。
 *
 * 好处：可以为不同后端服务（或不同环境）设置独立的配置，互不干扰。
 *
 * 2. baseURL: 'http://localhost:8012'
 * 含义：所有通过这个 request 实例发出的请求，都会自动拼接这个基础 URL。
 *
 * 例如：调用 request.get('/user/jwtToken')，实际请求地址是 http://localhost:8012/user/jwtToken。
 *
 * 为什么要写：
 *
 * 避免在每个接口中重复写完整域名或 IP。
 *
 * 方便后期切换环境（如开发、测试、生产），只需改这一处。
 *
 * 注意：如果某个请求需要覆盖 baseURL，可以在单次调用时传入 baseURL 参数或使用绝对地址 url: 'https://other.com/api'。
 *
 * 3. timeout: 10000
 * 含义：请求超时时间，单位是毫秒。这里 10000 毫秒 = 10 秒。
 *
 * 作用：如果从发起请求到收到响应的时间超过 10 秒，这个请求就会被自动取消，并进入 catch 错误处理。
 *
 * 常见值：通常设置为 5～30 秒，根据业务接口的响应速度调整。
 *
 * 4. 返回值 request
 * request 是一个自定义的 axios 实例，它拥有和原生 axios 几乎相同的方法（如 request.get()、request.post()、request.interceptors 等）。
 *
 * 之后项目中发送 HTTP 请求都使用这个 request 实例，而不是直接用 axios，以保证所有请求都遵循上述统一配置。
 */
const request = axios.create({
    baseURL: 'http://localhost:8012',
    timeout: 10000
})

// 请求拦截器：自动携带 token
request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('satoken')  // 与后端 token-name 保持一致
        if (token) {
            config.headers['satoken'] = token
        }
        return config
    },
    error => Promise.reject(error)
)

// 响应拦截器：处理 token 过期
request.interceptors.response.use(
    response => {
        // 假设后端返回 code 401 表示未登录或 token 失效
        if (response.data && response.data.code === 401) {
            localStorage.removeItem('satoken')
            window.location.href = '/login'
        }
        return response.data
    },
    error => {
        // 网络错误处理
        return Promise.reject(error)
    }
)

export default request
