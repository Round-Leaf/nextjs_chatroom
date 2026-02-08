// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth" // 这里的 @/auth 是指你定义 NextAuth 配置的那个 auth.ts 文件
export const { GET, POST } = handlers