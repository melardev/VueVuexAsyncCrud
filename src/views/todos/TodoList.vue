<template>
    <div class="container" v-if="getTodos.length>0">
        <h1>Todos</h1>
        <div>
            &nbsp;
            <router-link
                    class="btn btn-success"
                    to="/todos/new">
                Add new
            </router-link>
        </div>

        <table>
            <thead>
            <tr>
                <th>Title</th>
                <th>Completed</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr
                    v-for="(todo,index) in getTodos"
                    :to="'/todos/' + todo.id"
                    :key="todo.id"
                    :index="index">
                <td>
                    {{ todo.title }}
                </td>
                <td>
                    <label>Completed
                        <input
                                type="checkbox"
                                @click="toggleComplete(todo)"
                                :checked="todo.completed">
                    </label>
                </td>
                <td>
                    {{ todo.created_at }}
                </td>
                <td>
                    {{ todo.updated_at }}
                </td>
                <td>
                    <!-- <span (click)='getDetails(todo)' class='btn btn-info'>Details</span> -->
                    <router-link
                            :to="`/todos/${todo.id}`"
                            class="btn btn-primary active"
                            role="button"
                            router-link-active="active">
                        Details
                    </router-link>
                </td>
                <td>
                    <router-link
                            :to="`/todos/${todo.id}/edit`"
                            class="btn btn-warning"
                    >
                        Edit
                    </router-link>
                </td>
                <td>
                    <button
                            type="button"
                            class="btn btn-danger"
                            @click="deleteTodo(todo)"
                    >
                        Delete
                    </button>
                </td>
            </tr>
            </tbody>
        </table>

    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import {TodoAction} from "../../store/action.types";

    export default {
        name: "List",

        mounted() {
            this.fetchTodos();
        },
        methods: {
            ...mapActions({
                updateTodo: TodoAction.remote.UPDATE_TODO,
                fetchTodos: TodoAction.remote.FETCH_TODOS,
                deleteTodo: TodoAction.remote.DELETE_TODO
            }),

            toggleComplete(todo) {
                this.updateTodo({todo, partial: true});
            },

        },
        computed: {
            ...mapGetters(['getTodos']),
        }
    }
</script>

<style scoped>

</style>
