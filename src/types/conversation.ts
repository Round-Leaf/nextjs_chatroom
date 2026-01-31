import * as z from "zod"
export const conversationSchema = z.object({
    id:z.number(),
    type:z.string(),
    name:z.string(),
    created_at:z.string(),
    avatar_url:z.string(),
});
export type conversation = Omit<z.infer<typeof conversationSchema>,"avatar_url"> & {avatar_url?:string};