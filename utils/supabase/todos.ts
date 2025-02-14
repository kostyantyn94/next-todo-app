"use server"
import { createClient } from "./server";

export const fetchTodos = async (userId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Ошибка при получении задач:", error);
        return [];
    }
    return data;
};

