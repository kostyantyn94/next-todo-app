export type Todo = {
    id: string;
    user_id: string;
    created_at?: string;
    title: string;
    completed: boolean;
    status: string;
    deadline?: string;
};