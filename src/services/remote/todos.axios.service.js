import {AxiosService} from "./base/axios.service";

export const TodoAxiosService = {
    fetchAll(query = {}) {
        if (query.completed)
            return AxiosService.get('todos/pending');
        else if (query.completed === false)
            return AxiosService.get('todos/completed');
        else
            return AxiosService.get('todos');
    },
    fetchById(id) {
        return AxiosService.get(`/todos/${id}`);
    },
    create(todo) {
        return AxiosService.post('/todos', todo);
    },
    update(todo) {
        return AxiosService.put(`/todos/${todo.id}`, todo);
    },
    delete(todo) {
        return AxiosService.delete(`/todos/${todo.id}`);
    }
};
