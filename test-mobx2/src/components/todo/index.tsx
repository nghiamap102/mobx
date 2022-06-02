import React from "react";
import { observer } from "mobx-react-lite";
import TodoStore from "../../store/TodoStore";

const TodoList = () => {
    const todoStore = React.useContext<any>(TodoStore);
    const { todos, toggleTodo, removeTodo } = todoStore;
    return (
        <>
            <div className="row">
                <table className="table table-hover">
                    <thead className="thead-light">
                        <tr>
                            <th>Title</th>
                            <th>Completed?</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todos.map((todo:any) => (
                            <tr key={todo.id}>
                                <td>{todo.title}</td>
                                <td>{todo.completed ? "done" : "x"}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-info"
                                        onClick={() => toggleTodo(todo.id!)}
                                    >
                                        Toggle
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeTodo(todo.id!)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default observer(TodoList);