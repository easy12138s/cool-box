# EasyBox 后端管理系统 API 文档

**版本**: v1.0.0  
**更新时间**: 2026-03-31  
**基础URL**: `http://{host}:8082/api/v1`

---

## 一、认证方式

### 1.1 登录接口

**接口地址**: `/admin/login`  
**请求方法**: `POST`  
**Content-Type**: `application/json`

**请求体**:
```json
{
  "username": "easy2022163@163.c0m",
  "password": "admin123"
}
```

**响应示例**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

**说明**:
- `username`: 管理员邮箱（使用 `FIRST_SUPERUSER` 环境变量配置的用户）
- `password`: 管理员密码
- `expires_in`: Token 有效期（秒），24小时 = 86400秒

---

### 1.2 后续请求认证

所有 `/admin/` 和 `/admin/stats/` 接口都需要在请求头中携带 Token：

```
Authorization: Bearer {access_token}
```

**示例**:
```javascript
fetch('/api/v1/admin/projects', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
})
```

---

## 二、项目管理

### 2.1 获取项目列表

**接口地址**: `/admin/projects`  
**请求方法**: `GET`  
**认证**: Bearer Token

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| skip | int | 否 | 跳过记录数，默认 0 |
| limit | int | 否 | 返回记录数，默认 100 |

**响应示例**:
```json
{
  "data": [
    {
      "code": "cool_bookkeeping",
      "name": "记账应用",
      "description": "酷记账App",
      "is_active": true,
      "rate_limit": 60,
      "updated_at": "2026-03-30T06:57:09.089678",
      "id": 2,
      "token_expire_hours": 720,
      "created_at": "2026-03-23T06:25:42.000000"
    }
  ],
  "count": 1
}
```

---

### 2.2 创建项目

**接口地址**: `/admin/projects`  
**请求方法**: `POST`  
**认证**: Bearer Token

**请求体**:
```json
{
  "code": "new_project",
  "name": "新项目",
  "description": "项目描述",
  "token_expire_hours": 720,
  "rate_limit": 60
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 项目代码（唯一） |
| name | string | 是 | 项目名称 |
| description | string | 否 | 项目描述 |
| token_expire_hours | int | 否 | Token有效期(小时)，默认720 |
| rate_limit | int | 否 | 每分钟请求限制，默认60 |

---

### 2.3 获取项目详情

**接口地址**: `/admin/projects/{project_id}`  
**请求方法**: `GET`  
**认证**: Bearer Token

---

### 2.4 更新项目

**接口地址**: `/admin/projects/{project_id}`  
**请求方法**: `PUT`  
**认证**: Bearer Token

**请求体**: 同创建项目

---

### 2.5 删除项目

**接口地址**: `/admin/projects/{project_id}`  
**请求方法**: `DELETE`  
**认证**: Bearer Token

---

## 三、凭证管理

### 3.1 获取凭证列表

**接口地址**: `/admin/credentials`  
**请求方法**: `GET`  
**认证**: Bearer Token

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| skip | int | 否 | 跳过记录数，默认 0 |
| limit | int | 否 | 返回记录数，默认 100 |

---

### 3.2 获取项目下的凭证

**接口地址**: `/admin/projects/{project_id}/credentials`  
**请求方法**: `GET`  
**认证**: Bearer Token

---

### 3.3 删除凭证

**接口地址**: `/admin/credentials/{credential_id}`  
**请求方法**: `DELETE`  
**认证**: Bearer Token

---

## 四、邀请码管理

### 4.1 获取邀请码列表

**接口地址**: `/admin/invitation-codes`  
**请求方法**: `GET`  
**认证**: Bearer Token

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| skip | int | 否 | 跳过记录数，默认 0 |
| limit | int | 否 | 返回记录数，默认 100 |

**响应示例**:
```json
{
  "data": [
    {
      "code": "COOL2026",
      "max_uses": 100,
      "used_count": 25,
      "is_active": true,
      "created_at": "2026-03-23T06:25:42.000000",
      "expires_at": "2026-12-31T23:59:59.000000"
    }
  ],
  "count": 1
}
```

---

### 4.2 创建邀请码

**接口地址**: `/admin/invitation-codes`  
**请求方法**: `POST`  
**认证**: Bearer Token

**请求体**:
```json
{
  "code": "NEW_CODE",
  "max_uses": 100,
  "is_active": true,
  "expires_at": "2026-12-31T23:59:59"
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 邀请码（唯一） |
| max_uses | int | 否 | 最大使用次数，默认1 |
| is_active | bool | 否 | 是否启用，默认true |
| expires_at | string | 否 | 过期时间，格式 YYYY-MM-DD |

---

### 4.3 更新邀请码

**接口地址**: `/admin/invitation-codes/{code_id}`  
**请求方法**: `PUT`  
**认证**: Bearer Token

---

### 4.4 删除邀请码

**接口地址**: `/admin/invitation-codes/{code_id}`  
**请求方法**: `DELETE`  
**认证**: Bearer Token

---

## 五、服务配置管理

### 5.1 获取配置列表

**接口地址**: `/admin/service-configs`  
**请求方法**: `GET`  
**认证**: Bearer Token

**响应示例**:
```json
{
  "data": [
    {
      "id": 1,
      "code_id": 1,
      "config_json": "{\"llm\":{...},\"baidu_speech\":{...}}",
      "created_at": "2026-03-23T06:25:43.000000",
      "updated_at": "2026-03-23T06:25:43.000000"
    }
  ],
  "count": 1
}
```

---

### 5.2 创建配置

**接口地址**: `/admin/service-configs`  
**请求方法**: `POST`  
**认证**: Bearer Token

**请求体**:
```json
{
  "code_id": 1,
  "config_json": "{\"llm\":{\"api_key\":\"xxx\",\"base_url\":\"xxx\",\"model\":\"xxx\"},\"baidu_speech\":{\"app_id\":\"xxx\",\"api_key\":\"xxx\",\"secret_key\":\"xxx\"}}"
}
```

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code_id | int | 是 | 关联的邀请码ID |
| config_json | string | 是 | 配置JSON字符串 |

**config_json 示例**:
```json
{
  "llm": {
    "api_key": "sk-xxx",
    "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
    "model": "MiniMax-M2.5"
  },
  "baidu_speech": {
    "app_id": "7538523",
    "api_key": "xxx",
    "secret_key": "xxx"
  }
}
```

---

### 5.3 更新配置

**接口地址**: `/admin/service-configs/{config_id}`  
**请求方法**: `PUT`  
**认证**: Bearer Token

---

### 5.4 删除配置

**接口地址**: `/admin/service-configs/{config_id}`  
**请求方法**: `DELETE`  
**认证**: Bearer Token

---

## 六、日志查询

### 6.1 获取日志列表

**接口地址**: `/admin/logs`  
**请求方法**: `GET`  
**认证**: Bearer Token

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| project_id | int | 否 | 按项目筛选 |
| skip | int | 否 | 跳过记录数，默认 0 |
| limit | int | 否 | 返回记录数，默认 100 |

**响应示例**:
```json
{
  "data": [
    {
      "id": 1,
      "credential_id": 1,
      "project_id": 2,
      "endpoint": "/services/llm/chat",
      "method": "POST",
      "ip": "127.0.0.1",
      "status_code": 200,
      "duration_ms": 150,
      "created_at": "2026-03-31T12:00:00.000000"
    }
  ],
  "count": 100
}
```

---

## 七、统计接口

### 7.1 总体统计

**接口地址**: `/admin/stats`  
**请求方法**: `GET`  
**认证**: Bearer Token

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| project_id | int | 否 | 按项目筛选 |
| start_date | string | 否 | 开始日期 YYYY-MM-DD，默认7天前 |
| end_date | string | 否 | 结束日期 YYYY-MM-DD，默认今天 |

**响应示例**:
```json
{
  "total_calls": 1000,
  "success_rate": 99.5,
  "avg_duration_ms": 150.5,
  "by_endpoint": {
    "/services/llm/chat": 120.5
  },
  "by_status": {
    "200": 995,
    "400": 5
  },
  "date_range": {
    "start": "2026-03-24",
    "end": "2026-03-31"
  }
}
```

---

### 7.2 每日趋势

**接口地址**: `/admin/stats/daily`  
**请求方法**: `GET`  
**认证**: Bearer Token

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| project_id | int | 否 | 按项目筛选 |
| days | int | 否 | 最近天数，默认7，最大90 |

**响应示例**:
```json
{
  "data": [
    {"date": "2026-03-30", "calls": 500, "success_rate": 99.2},
    {"date": "2026-03-29", "calls": 480, "success_rate": 99.5}
  ],
  "days": 7
}
```

---

### 7.3 项目统计

**接口地址**: `/admin/stats/projects`  
**请求方法**: `GET`  
**认证**: Bearer Token

**响应示例**:
```json
{
  "data": [
    {
      "id": 2,
      "code": "cool_bookkeeping",
      "name": "记账应用",
      "is_active": true,
      "registered_devices": 120,
      "total_calls": 8000,
      "avg_duration_ms": 120.5
    }
  ]
}
```

---

### 7.4 邀请码统计

**接口地址**: `/admin/stats/invitation-codes`  
**请求方法**: `GET`  
**认证**: Bearer Token

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| project_id | int | 否 | 按项目筛选 |

**响应示例**:
```json
{
  "data": [
    {
      "id": 1,
      "code": "COOL2026",
      "registered_devices": 100,
      "total_calls": 5000,
      "max_uses": 100,
      "used_count": 50,
      "is_active": true,
      "expires_at": "2026-12-31T23:59:59",
      "last_used_at": "2026-03-31T12:00:00"
    }
  ]
}
```

---

## 八、错误码

| HTTP状态码 | 错误信息 | 说明 |
|------------|----------|------|
| 401 | Invalid credentials | 用户名或密码错误 |
| 401 | User is inactive | 用户已被禁用 |
| 403 | Not a superuser | 不是超级管理员 |
| 401 | Invalid token | Token 格式错误 |
| 401 | Token expired | Token 已过期 |

---

## 九、前端接入示例

### JavaScript (Fetch API)

```javascript
class AdminApi {
  constructor(baseUrl = 'http://localhost:8082/api/v1') {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('admin_token');
  }

  async login(username, password) {
    const res = await fetch(`${this.baseUrl}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.access_token) {
      this.token = data.access_token;
      localStorage.setItem('admin_token', this.token);
    }
    return data;
  }

  async fetch(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers
    };
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });
    if (res.status === 401) {
      // Token 过期，跳转登录
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
      return null;
    }
    return res.json();
  }

  // 项目管理
  getProjects() { return this.fetch('/admin/projects'); }
  createProject(data) { return this.fetch('/admin/projects', { method: 'POST', body: JSON.stringify(data) }); }
  
  // 邀请码管理
  getInvitationCodes() { return this.fetch('/admin/invitation-codes'); }
  createInvitationCode(data) { return this.fetch('/admin/invitation-codes', { method: 'POST', body: JSON.stringify(data) }); }
  
  // 服务配置管理
  getServiceConfigs() { return this.fetch('/admin/service-configs'); }
  createServiceConfig(data) { return this.fetch('/admin/service-configs', { method: 'POST', body: JSON.stringify(data) }); }
  
  // 统计
  getStats() { return this.fetch('/admin/stats'); }
  getDailyStats(days = 7) { return this.fetch(`/admin/stats/daily?days=${days}`); }
  getProjectStats() { return this.fetch('/admin/stats/projects'); }
  getInvitationCodeStats() { return this.fetch('/admin/stats/invitation-codes'); }
}

// 使用示例
const api = new AdminApi();

// 登录
await api.login('easy2022163@163.c0m', 'admin123');

// 获取项目列表
const projects = await api.getProjects();
console.log(projects);

// 创建邀请码
await api.createInvitationCode({
  code: 'NEW2026',
  max_uses: 100,
  expires_at: '2026-12-31'
});

// 获取统计
const stats = await api.getStats();
console.log(stats);
```

### Vue 3 (Composition API)

```javascript
// api/admin.js
import { ref } from 'vue';

const API_BASE = 'http://localhost:8082/api/v1';

export function useAdminApi() {
  const token = ref(localStorage.getItem('admin_token') || '');
  const isLoggedIn = () => !!token.value;

  const login = async (username, password) => {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.access_token) {
      token.value = data.access_token;
      localStorage.setItem('admin_token', data.access_token);
    }
    return data;
  };

  const request = async (endpoint, options = {}) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`,
        ...options.headers
      }
    });
    return res.json();
  };

  return {
    token,
    isLoggedIn,
    login,
    request,
    getProjects: () => request('/admin/projects'),
    createProject: (data) => request('/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
    getInvitationCodes: () => request('/admin/invitation-codes'),
    createInvitationCode: (data) => request('/admin/invitation-codes', { method: 'POST', body: JSON.stringify(data) }),
    getServiceConfigs: () => request('/admin/service-configs'),
    createServiceConfig: (data) => request('/admin/service-configs', { method: 'POST', body: JSON.stringify(data) }),
    getStats: () => request('/admin/stats'),
    getDailyStats: (days) => request(`/admin/stats/daily?days=${days}`),
    getProjectStats: () => request('/admin/stats/projects'),
    getInvitationCodeStats: () => request('/admin/stats/invitation-codes'),
  };
}
```

---

**文档结束**
