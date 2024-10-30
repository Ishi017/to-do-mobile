
const API_URL = process.env.REACT_APP_API_URL;

export const fetchTodos = async () => {
    const response = await fetch(`${API_URL}/todos`);
    return response.json();
};

export const addTodo = async (todo) => {
    const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
    });
    return response.json();
};

export const deleteTodo = async (id) => {
    await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
};

export const updateTodo = async (id, updatedFields) => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
    });
    return response.json();
};