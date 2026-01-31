import * as z from "zod" 
export const userSchema = z.object({
    id:z.number(),
    username:z.string(),
    password_hash:z.string(),
    avatar_url:z.string(),
    created_at:z.string()
});
export type user = z.infer<typeof userSchema>