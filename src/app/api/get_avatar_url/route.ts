import { auth } from "@/auth";
import { getAvatarUrl } from "@/app/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
    const session = await auth();
    if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    };
    const user_id = Number(session?.user?.id);
    const searchParams = request.nextUrl.searchParams;
    const avatarUrl = await getAvatarUrl(user_id);
    console.log(avatarUrl)
    return NextResponse.redirect(avatarUrl)
}