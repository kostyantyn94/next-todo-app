import {createClient} from "@/utils/supabase/server";
import {NextResponse} from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { title, status, deadline } = await request.json();
    const todoId = params.id;
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("todos")
        .update({ title, status, deadline })
        .eq("id", todoId)
        .select()
        .single();
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ todo: data });
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { completed } = await request.json();
    const todoId = params.id;
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("todos")
        .update({ completed })
        .eq("id", todoId)
        .select()
        .single();
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ todo: data });
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const todoId = params.id;
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("todos")
        .delete()
        .eq("id", todoId)
        .select()
        .single();
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ todo: data });
}