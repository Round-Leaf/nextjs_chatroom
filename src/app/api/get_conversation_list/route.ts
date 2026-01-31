import { getConversationList } from "@/app/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
    const searchParams = request.nextUrl.searchParams;
    const user_id = Number(searchParams.get("user_id"));
    console.log(user_id)
    return NextResponse.json(await getConversationList(user_id));
}