import * as z from "zod"
export const messageSchema = z.object({
    id:z.number(),
    conversation_id: z.number(),
    user_id: z.number(),
    content: z.string(),
    type: z.string(),
    created_at: z.string()
})
export type message = z.infer<typeof messageSchema>;