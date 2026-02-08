'use server'
import { registerSchema } from "@/types/user";
import { createUser, getUser } from "../lib/actions";
import z from "zod";
export async function registerAction(initialState: any,formData: FormData) {
  const validation = registerSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!validation.success) {
    return {
      success: false,
      errors: z.treeifyError(validation.error),
      message: "请检查输入字段。",
    };
  } else {
    const { username, password } = validation.data;
    if ((await getUser(username)).length > 0) {
      return {
        success: false,
        message: "用户名已存在",
      };
    } else {
      createUser(username,password);
      return {
        success: false,
        message: "注册成功！",
      };
    }
  }
}
