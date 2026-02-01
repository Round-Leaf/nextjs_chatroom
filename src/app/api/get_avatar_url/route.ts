import { getAvatarUrl } from "@/app/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
    const searchParams = request.nextUrl.searchParams;
    const user_id = Number(searchParams.get("user_id"));
    const avatarUrl = await getAvatarUrl(user_id);
    console.log(avatarUrl)
    return NextResponse.redirect(avatarUrl)
}