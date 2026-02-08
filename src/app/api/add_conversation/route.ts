import { addUsersToConversation, createConversation, getConversationList } from "@/app/lib/actions";
import { auth } from "@/auth";
import { conversation } from "@/types/conversation";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export const POST = async(request:NextRequest)=>{
    const session = await auth();
    const id = session?.user?.id;
    const post = await request.json();
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const type:"public"|"private" = post.type;
    const members:number[] = post.members;
    members.push(Number(id));
    const name = post.name??"null";
    const newConversation:conversation = await createConversation({type:type,name:name,avatar_url:"https://i.pravatar.cc/"+randomNumber});
    addUsersToConversation(newConversation.id,members);
    return NextResponse.json({
        success:true,
        conversation:newConversation
    });
}