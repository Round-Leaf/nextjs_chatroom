// actions/auth.ts
"use server"
import { signIn } from "../auth";

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    // 注意：Auth.js 在重定向时会抛出错误，这是正常的
    // 如果是凭据错误，可以在这里处理
    throw error;
  }
}