// actions/auth.ts
"use server"
import { FormStatus } from "react-dom";
import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
export async function loginAction(initialState: any,formData: FormData) {
  try {
    await signIn("credentials", formData);
    return {message:"Login Success",success:true};
  } catch (error) {
    if(isRedirectError(error))  throw error;
    return {message:"Login Failed",error:(error as Error).message,success:false};
  }
}