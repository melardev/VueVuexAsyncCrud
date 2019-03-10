import Vue from 'vue';
import Router from 'vue-router';
import TodoList from './views/todos/TodoList';
import TodoDetails from './views/todos/TodoDetails';
import TodoCreateOrEdit from './views/todos/TodoCreateOrEdit';

Vue.use(Router);

export const router = new Router({
  routes: [
    {path: '/', redirect: {name: 'todo-list'}},
    // { path: '/a', redirect: '/todos' },
    {
      path: '/todos',
      name: 'todo-list',
      component: TodoList,
    },
    {
      path: '/todos/new',
      name: 'create',
      component: TodoCreateOrEdit,
    },
    {
      path: '/todos/:id',
      name: 'todo-details',
      component: TodoDetails,
    },
    {
      path: '/todos/:id/edit',
      name: 'todo-edit',
      component: TodoCreateOrEdit,
    },
  ]
});
