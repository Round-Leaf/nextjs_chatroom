import { getMessagesFromConversation } from "@/app/lib/actions";
import { conversation } from "@/types/conversation";
import { message, messageWithAvatarURL } from "@/types/message";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
    const searchParams = request.nextUrl.searchParams;
    const conversation_id = Number(searchParams.get("conversation_id"));
    const messages:messageWithAvatarURL[] = await getMessagesFromConversation(conversation_id);
    return NextResponse.json(messages);
}