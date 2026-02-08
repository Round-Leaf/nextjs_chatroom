import { auth } from "@/auth";
import { getConversationList } from "@/app/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
        const session = await auth();
        if (!session?.user?.id) {
        console.log(session?.user)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        };
        const user_id = Number(session?.user?.id);
    return NextResponse.json(await getConversationList(user_id));
}