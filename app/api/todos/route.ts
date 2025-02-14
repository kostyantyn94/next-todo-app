import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";


export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("todos").select("*").order("created_at", { ascending: false });
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ todos: data });
}

export async function POST(request: Request) {
    const { userId, title, status, deadline } = await request.json();
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("todos")
        .insert({ user_id: userId, title, completed: false, status: status, deadline: deadline })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ todo: data });
}

