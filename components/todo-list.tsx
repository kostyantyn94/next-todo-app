"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";
import {fetchTodos, createTodo, updateTodo, toggleTodo, deleteTodo} from "@/utils/api";
import {reorder} from "@/utils/reorder";
import {Todo} from "@/utils/types";

// ---------- Helper: Status Badge Component ----------
function getStatusBadge(status: string) {
    switch (status) {
        case "urgent":
            return (
                <span className="bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] px-2 py-1 rounded text-xs font-semibold">
          Urgent
        </span>
            );
        case "normal":
            return (
                <span className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-2 py-1 rounded text-xs font-semibold">
          Normal
        </span>
            );
        case "low":
            return (
                <span className="bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] px-2 py-1 rounded text-xs font-semibold">
          Low
        </span>
            );
        default:
            return (
                <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
          {status}
        </span>
            );
    }
}

// ---------- Helper: Deadline Badge Component ----------
function getDeadlineBadge(deadline?: string) {
    if (!deadline) return null;
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) return null;

    const now = new Date();
    const timeDiff = deadlineDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff <= 48) {
        return (
            <span className="bg-[hsl(var(--chart-4))] text-[hsl(var(--foreground))] px-2 py-1 rounded text-xs ml-2 font-semibold">
                Deadline Soon
            </span>
        );
    }
    return null;
}

// ---------- TodoList Component ----------
export default function TodoList({
                                     userId,
                                 }: {
    userId: string;
}) {
    const queryClient = useQueryClient();

    const {
        data: todos = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["todos"],
        queryFn: fetchTodos,
    });

    const [newTodo, setNewTodo] = useState("");
    const [newStatus, setNewStatus] = useState("normal");
    const [newDeadline, setNewDeadline] = useState(new Date().toISOString().split("T")[0]);
    const [editingTodo, setEditingTodo] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [editStatus, setEditStatus] = useState("normal");
    const [editDeadline, setEditDeadline] = useState("");

    // ---------- Add Todo Mutation ----------
    const addMutation = useMutation({
        mutationFn: (vars: {
            userId: string;
            title: string;
            status: string;
            deadline: string;
        }) => createTodo(vars.userId, vars.title, vars.status, vars.deadline),
        onMutate: async (vars) => {
            await queryClient.cancelQueries({ queryKey: ["todos"] });
            const prevTodos = queryClient.getQueryData<Todo[]>(["todos"]) || [];
            const tempId = "temp-" + Date.now();
            const optimistic: Todo = {
                id: tempId,
                user_id: vars.userId,
                title: vars.title,
                completed: false,
                status: vars.status,
                deadline: vars.deadline,
            };
            queryClient.setQueryData<Todo[]>(["todos"], [optimistic, ...prevTodos]);
            return { prevTodos };
        },
        onError: (err, vars, context) => {
            if (context?.prevTodos) {
                queryClient.setQueryData(["todos"], context.prevTodos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    function handleAddTodo() {
        if (!newTodo.trim()) return;
        addMutation.mutate({
            userId,
            title: newTodo,
            status: newStatus,
            deadline: newDeadline,
        });
        setNewTodo("");
        setNewStatus("normal");
        setNewDeadline(new Date().toISOString().split("T")[0]);
    }

    // ---------- Update Todo Mutation ----------
    const updateMutation = useMutation({
        mutationFn: (vars: {
            todoId: string;
            title: string;
            status: string;
            deadline: string;
        }) => updateTodo(vars.todoId, vars.title, vars.status, vars.deadline),
        onMutate: async (vars) => {
            await queryClient.cancelQueries({ queryKey: ["todos"] });
            const prevTodos = queryClient.getQueryData<Todo[]>(["todos"]) || [];
            queryClient.setQueryData<Todo[]>(["todos"], (old) =>
                old
                    ? old.map((todo) =>
                        todo.id === vars.todoId
                            ? {
                                ...todo,
                                title: vars.title,
                                status: vars.status,
                                deadline: vars.deadline,
                            }
                            : todo
                    )
                    : []
            );
            return { prevTodos };
        },
        onError: (err, vars, context) => {
            if (context?.prevTodos) {
                queryClient.setQueryData(["todos"], context.prevTodos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    function handleUpdateTodo(todoId: string) {
        if (!editText.trim()) return;
        updateMutation.mutate({
            todoId,
            title: editText,
            status: editStatus,
            deadline: editDeadline,
        });
        setEditingTodo(null);
        setEditText("");
        setEditStatus("normal");
        setEditDeadline("");
    }

    // ---------- Toggle Todo Mutation ----------
    const toggleMutation = useMutation({
        mutationFn: (vars: { todoId: string; completed: boolean }) =>
            toggleTodo(vars.todoId, vars.completed),
        onMutate: async (vars) => {
            await queryClient.cancelQueries({ queryKey: ["todos"] });
            const prevTodos = queryClient.getQueryData<Todo[]>(["todos"]) || [];
            queryClient.setQueryData<Todo[]>(["todos"], (old) =>
                old
                    ? old.map((todo) =>
                        todo.id === vars.todoId
                            ? { ...todo, completed: vars.completed }
                            : todo
                    )
                    : []
            );
            return { prevTodos };
        },
        onError: (err, vars, context) => {
            if (context?.prevTodos) {
                queryClient.setQueryData(["todos"], context.prevTodos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    function handleToggleComplete(todoId: string, completed: boolean) {
        toggleMutation.mutate({ todoId, completed: !completed });
    }

    // ---------- Delete Todo Mutation ----------
    const deleteMutation = useMutation({
        mutationFn: (todoId: string) => deleteTodo(todoId),
        onMutate: async (todoId) => {
            await queryClient.cancelQueries({ queryKey: ["todos"] });
            const prevTodos = queryClient.getQueryData<Todo[]>(["todos"]) || [];
            queryClient.setQueryData<Todo[]>(["todos"], (old) =>
                old ? old.filter((t) => t.id !== todoId) : []
            );
            return { prevTodos };
        },
        onError: (err, todoId, context) => {
            if (context?.prevTodos) {
                queryClient.setQueryData(["todos"], context.prevTodos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    function handleDeleteTodo(todoId: string) {
        deleteMutation.mutate(todoId);
    }

    // ---------- Drag & Drop Handler ----------
    function handleDragEnd(result: DropResult) {
        if (!result.destination) return;
        const reordered = reorder(todos, result.source.index, result.destination.index);
        queryClient.setQueryData(["todos"], reordered);
    }

    if (isLoading) return <div className="p-4">Loading...</div>;
    if (isError) return <div className="p-4">Error: {(error as Error).message}</div>;

    return (
        <div className="min-h-screen bg-background text-foreground p-6 transition-colors duration-300">
            <div className="max-w-3xl mx-auto bg-card rounded shadow-md p-6 border border-border">
                <h1 className="text-2xl font-bold mb-6 text-center">My ToDo List</h1>

                {/* Form for creating a new task */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-end">
                    {/* Task Title */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="newTaskTitle"
                            className="mb-1 text-sm font-semibold text-card-foreground"
                        >
                            Task Title
                        </label>
                        <input
                            id="newTaskTitle"
                            className="border border-border bg-card rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            placeholder="e.g. Buy groceries"
                        />
                    </div>

                    {/* Priority */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="newStatus"
                            className="mb-1 text-sm font-semibold text-card-foreground"
                        >
                            Priority
                        </label>
                        <select
                            id="newStatus"
                            className="border border-border bg-card rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <option value="urgent">Urgent</option>
                            <option value="normal">Normal</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    {/* Deadline */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="newDeadline"
                            className="mb-1 text-sm font-semibold text-card-foreground"
                        >
                            Deadline
                        </label>
                        <input
                            id="newDeadline"
                            type="date"
                            className="border border-border bg-card rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                            value={newDeadline}
                            onChange={(e) => setNewDeadline(e.target.value)}
                        />
                    </div>

                    {/* Add Button */}
                    <div className="flex">
                        <button
                            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold px-4 py-2 rounded transition-colors w-full"
                            onClick={handleAddTodo}
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Todo List (Drag & Drop) */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="todos">
                        {(provided) => (
                            <ul
                                className="space-y-3"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {todos.map((todo, index) => (
                                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                                        {(provided) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="p-4 bg-card rounded border border-border shadow-sm flex justify-between items-center gap-2 hover:shadow transition-shadow"
                                            >
                                                <div className="flex items-center gap-3 grow">
                                                    <input
                                                        type="checkbox"
                                                        checked={todo.completed}
                                                        onChange={() =>
                                                            handleToggleComplete(todo.id, todo.completed)
                                                        }
                                                        className="cursor-pointer w-4 h-4 accent-[hsl(var(--accent))]"
                                                    />
                                                    {editingTodo === todo.id ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                className="border border-border bg-card rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                                                                value={editText}
                                                                onChange={(e) => setEditText(e.target.value)}
                                                            />
                                                            <select
                                                                className="border border-border bg-card rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                                                                value={editStatus}
                                                                onChange={(e) => setEditStatus(e.target.value)}
                                                            >
                                                                <option value="urgent">Urgent</option>
                                                                <option value="normal">Normal</option>
                                                                <option value="low">Low</option>
                                                            </select>
                                                            <input
                                                                type="date"
                                                                className="border border-border bg-card rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                                                                value={editDeadline}
                                                                onChange={(e) => setEditDeadline(e.target.value)}
                                                            />
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col">
                              <span
                                  className={
                                      todo.completed
                                          ? "line-through text-muted-foreground"
                                          : ""
                                  }
                              >
                                {todo.title}
                              </span>
                                                            <div className="flex items-center gap-2">
                                                                {getStatusBadge(todo.status)}
                                                                {todo.deadline && (
                                                                    <span className="text-xs text-muted-foreground flex items-center">
                                    Due:{" "}
                                                                        {new Date(todo.deadline).toLocaleDateString()}
                                                                        {getDeadlineBadge(todo.deadline)}
                                  </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    {editingTodo === todo.id ? (
                                                        <button
                                                            className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-3 py-2 rounded font-semibold transition-colors"
                                                            onClick={() => handleUpdateTodo(todo.id)}
                                                        >
                                                            Save
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-3 py-2 rounded font-semibold transition-colors"
                                                            onClick={() => {
                                                                setEditingTodo(todo.id);
                                                                setEditText(todo.title);
                                                                setEditStatus(todo.status);
                                                                setEditDeadline(todo.deadline ? todo.deadline.split("T")[0] : new Date().toISOString().split("T")[0]);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                    )}
                                                    <button
                                                        className="bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] px-3 py-2 rounded font-semibold transition-colors"
                                                        onClick={() => handleDeleteTodo(todo.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}
