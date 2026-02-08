import { NextRequest, NextResponse } from "next/server";
import "zod"
import { message, messageSchema, messageWithAvatarURL } from "@/types/message";
import { getAvatarUrl, getUsersFromConversation, sendMessage } from "@/app/lib/actions";
import { chatEmitter } from "@/app/lib/chat-events";
import { userInGroup } from "@/types/user";
import { auth } from "@/auth";
const newMessage = messageSchema.omit({id:true,created_at:true});
export async function POST(request:NextRequest){
        const session = await auth();
        if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        };
        const user_id = Number(session?.user?.id);
    const formData = await request.json();
    const conversation_id = formData.conversation_id;
    const content = formData.content;
    const type = formData.type;
    const rawNewMessage = {conversation_id,user_id,content,type};
    const messageJson=newMessage.parse(rawNewMessage);
    const sentMessage:message = await sendMessage(messageJson)
    const receivers:userInGroup[]=await getUsersFromConversation(messageJson.conversation_id);
    const avatarUrl = await getAvatarUrl(user_id);
    const messageWithAvatarURL:messageWithAvatarURL = {...sentMessage,avatar_url:avatarUrl};
    //console.log(receivers)
    for(let receiver of receivers){
        chatEmitter.emit("newMessage"+receiver.user_id,messageWithAvatarURL);
    }
    return NextResponse.json({
        result:"success"
    })
}