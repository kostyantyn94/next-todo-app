import {Todo} from "@/utils/types";

export async function fetchTodos(): Promise<Todo[]> {
    const res = await fetch("/api/todos");
    if (!res.ok) throw new Error("Failed to fetch todos");
    const json = await res.json();
    return json.todos;
}

export async function createTodo(
    userId: string,
    title: string,
    status: string,
    deadline: string
) {
    const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title, status, deadline }),
    });
    if (!res.ok) throw new Error("Failed to create todo");
    return res.json(); // expected { todo: {...} }
}

export async function updateTodo(todoId: string, title: string, status: string, deadline: string) {
    const res = await fetch(`/api/todos/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status, deadline }),
    });
    if (!res.ok) throw new Error("Failed to update todo");
    return res.json();
}

export async function toggleTodo(todoId: string, completed: boolean) {
    const res = await fetch(`/api/todos/${todoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error("Failed to toggle todo");
    return res.json();
}

export async function deleteTodo(todoId: string) {
    const res = await fetch(`/api/todos/${todoId}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete todo");
    return res.json();
}