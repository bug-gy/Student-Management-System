# Auth API Contracts

## POST /api/auth/login
- Body: `{ email: string, password: string }`
- Response 200: `{ success: true, data: { user: User, accessToken: string }, message: "Login successful" }`
- Response 401: `{ success: false, data: null, message: "Invalid credentials" }`
- Response 429: `{ success: false, data: null, message: "Too many attempts" }`

## POST /api/auth/logout
- Headers: Cookie with refreshToken
- Response 200: `{ success: true, data: null, message: "Logged out" }`

## POST /api/auth/refresh
- Headers: Cookie with refreshToken
- Response 200: `{ success: true, data: { accessToken: string }, message: "Token refreshed" }`

## POST /api/auth/forgot-password
- Body: `{ email: string }`
- Response 200: `{ success: true, data: null, message: "Reset link sent (if email exists)" }`

## POST /api/auth/reset-password
- Body: `{ token: string, password: string }`
- Response 200: `{ success: true, data: null, message: "Password reset successful" }`

## GET /api/auth/me
- Headers: Authorization Bearer {token}
- Response 200: `{ success: true, data: { user: User }, message: "Profile fetched" }`
