import { searchUser } from "@/app/lib/actions";
import { user } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword");
    const users:user[] = await searchUser(keyword||"");
    return NextResponse.json(users);
}