import Vue from 'vue'
import Vuex from 'vuex'
import {TodoAction, UiAction} from "./action.types";
import {TodoAxiosService} from "../services/remote/todos.axios.service";

Vue.use(Vuex);


export const store = new Vuex.Store({
    state: {
        todos: [],
        selected_todo: {},

        toast: {message: '', class_name: ''},
        dialog: {message: '', type: ''}
    },
    mutations: {
        [TodoAction.local.SET_TODOS]: (state, todos) => {
            state.todos = todos;
        },
        [TodoAction.local.TODO_DELETED_SUCCESS](state, deletedTodoId) {
            state.todos = state.todos.filter(t => t.id !== deletedTodoId);
        },
        [TodoAction.local.SET_SELECTED_TODO](state, newTodo) {
            if (state.todos.length > 0)
                state.todos = state.todos.map(oldTodo => oldTodo.id === newTodo.id ? newTodo : oldTodo);
            else
                state.todos.push(newTodo);
        },

        // Intended for beginners having hard time to read the SET_SELECTED_TODO mutation and mechanics
        [TodoAction.local.SET_SELECTED_TODO_SIMPLE](state, newTodo) {
            state.selected_todo = newTodo;
        },
        'TODO_UPDATED_SUCCESS'(state, newTodo) {
            state.todos = state.todos.map(oldTodo => oldTodo.id === newTodo.id ? newTodo : oldTodo);
        },
        [UiAction.SHOW_TOAST_SUCCESS](state, message) {
            state.toast = {class_name: 'alert alert-success', message};
        },
        [UiAction.SHOW_TOAST_ERROR](state, message) {
            state.toast = {class_name: 'alert alert-danger', message};
        },
        [UiAction.CLEAR_TOAST](state) {
            state.toast = {message: '', class_name: ''};
        },
        [UiAction.SHOW_DIALOG_SUCCESS](state, message) {
            state.dialog = {class_name: 'alert alert-success', message};
        },
        [UiAction.SHOW_DIALOG_ERROR](state, message) {
            state.dialog = {class_name: 'alert alert-danger', message};
        },
        [UiAction.CLEAR_DIALOG](state) {
            state.dialog = {message: '', class_name: ''};
        }
    },
    actions: {
        // context is just an object containing the functions that we may use
        // to read from/write to the store. to make a sync operation we call context.commit which triggers a mutation
        // for an async operation we call context.dispatch which triggers a mutation. We also read state with context.state.todos
        [TodoAction.remote.FETCH_TODOS](context, args) {
            TodoAxiosService.fetchAll(args).then(res => {
                if (res.status === 200) {
                    context.commit(TodoAction.local.SET_TODOS, res.data);
                    context.commit(UiAction.SHOW_DIALOG_SUCCESS, 'Todos fetched!');
                } else {
                    debugger
                }
            }).catch(err => {
                debugger;
                context.commit(UiAction.SHOW_TOAST_ERROR, err.message);
                throw err;
            });
        },

        // Example using argument destructuring
        [TodoAction.remote.DELETE_TODO]: async ({commit}, todo) => {
            return new Promise((resolve, reject) => {
                TodoAxiosService.delete(todo).then(res => {
                    if (res.status === 204) {
                        commit(UiAction.SHOW_DIALOG_SUCCESS, 'Todo deleted!');
                        commit(TodoAction.local.TODO_DELETED_SUCCESS, todo.id);
                        resolve({success: true});
                    } else {
                        debugger;
                        resolve({success: false});
                    }
                }).catch(err => {
                    commit(UiAction.SHOW_TOAST_ERROR, err.message);
                    resolve({success: false});
                });
            });
        },
        [TodoAction.remote.FETCH_BY_ID](context, id) {
            return new Promise((resolve, reject) => {
                TodoAxiosService.fetchById(id).then(res => {
                    if (res.status === 200) {
                        context.commit(UiAction.SHOW_DIALOG_SUCCESS, 'Todo fetched!');
                        const todo = res.data;
                        context.commit(TodoAction.local.SET_SELECTED_TODO, todo);
                        context.commit(TodoAction.local.SET_SELECTED_TODO_SIMPLE, todo);
                        resolve({success: true, todo});
                    }
                    reject({success: false});
                }).catch(err => {
                    debugger;
                    context.commit(UiAction.SHOW_TOAST_ERROR, err.message);
                    reject({success: false});
                });
            });
        },
        [TodoAction.remote.UPDATE_TODO](context, todo) {
            return new Promise((resolve, reject) => {
                TodoAxiosService.update(todo).then(res => {
                    this.isSubmitting = false;
                    if (res.status === 200) {
                        context.commit(UiAction.SHOW_DIALOG_SUCCESS, 'Todo updated!');
                        context.commit(TodoAction.local.TODO_UPDATED_SUCCESS, res.data);
                        resolve({success: true});
                    }
                    resolve({success: false});
                }).catch(err => {
                    debugger;
                    context.commit(UiAction.SHOW_TOAST_ERROR, err.message);
                });
            });
        },

        [TodoAction.remote.CREATE_TODO](context, todo) {
            return new Promise((resolve, reject) => {
                TodoAxiosService.create(todo).then(res => {
                    if (res.status === 201) {
                        context.commit(UiAction.SHOW_DIALOG_SUCCESS, 'todo created!');
                        context.commit(TodoAction.local.TODO_CREATED_SUCCESS, res.data);
                        resolve({success: true});
                    }
                    reject({success: false});
                }).catch(err => {
                    debugger;
                    context.commit(UiAction.SHOW_TOAST_ERROR, err.message);
                    reject({success: false});
                });
            });
        }
    },
    getters: {
        getTodos: (state) => state.todos,
        getTodoById: (state) => (id) => state.todos.find(t => t.id === id),
        // or longer way:
        // getTodoById: (state) => (id) => {return state.todos.find(t => t.id === id)},
        /* or even longer but more readable for beginners
        getTodoById: (state) => {
            return (id) => {
                return state.todos.find(t => t.id === id)
            }
        },
         getTodoById: (state) => {
            return function(id) {
                return state.todos.find(t => t.id === id)
            }
        },
        */

        // If you are able to read and understand the above, skip this getSelectedTodo, it is intended for beginners
        getSelectedTodo: (state) => state.selected_todo,

        getToast: (state) => state.toast,
        getToastMessage: (state) => state.toast.message,
        getToastClass: (state) => state.toast.class_name,

        getDialog: (state) => state.dialog,
        getDialogMessage: (state) => state.dialog.message,
        getDialogType: (state) => state.type,
    }
});

