import {
    action,
    computed, makeAutoObservable, observable, reaction
} from "mobx";
import { createContext } from "react";
export interface Todo {
    id?: number;
    title: string;
    completed: boolean;
}

class TodoStore {
    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.todos,
            (_) => console.log(this.todos.length)
        );
    }

    @observable todos: Todo[] = [
        { id: 1, title: "Item #1", completed: false },
        { id: 2, title: "Item #2", completed: false },
        { id: 3, title: "Item #3", completed: false },
        { id: 4, title: "Item #4", completed: false },
        { id: 5, title: "Item #5", completed: true },
        { id: 6, title: "Item #6", completed: false }
    ];

    @action addTodo = (todo: Todo) => {
        this.todos.push({ ...todo, id: Date.now() });
    };

    @action toggleTodo = (id: number) => {
        this.todos = this.todos.map((todo) => {
            if (todo.id === id) {
                return {
                    ...todo,
                    completed: !todo.completed
                };
            }
            return todo;
        });
    };

    @action removeTodo = (id: number) => {
        console.log(id);
        this.todos = this.todos.filter((todo) => todo.id !== id);
        console.log(this.todos);
    };

    @computed get info() {
        return {
            total: this.todos.length,
            completed: this.todos.filter((todo) => todo.completed).length,
            notCompleted: this.todos.filter((todo) => !todo.completed).length
        };
    }
}

export default createContext(new TodoStore());
