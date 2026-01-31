import { NextRequest } from "next/server";
import "zod"
import { message, messageSchema } from "@/types/message";
const newMessage = messageSchema.omit({id:true,created_at:true});
export async function POST(request:NextRequest){
    const formData = await request.formData();
    const conversation_id = formData.get("conversation_id");
    const sender_id = formData.get("sender_id");
    const content = formData.get("content");
    const type = formData.get("type");
    const rawNewMessage = {conversation_id,sender_id,content,type};
    newMessage.parse(rawNewMessage);
}