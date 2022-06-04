import React from "react";
import { observer } from "mobx-react-lite";
import { RootStoresContext } from "../../stores";

const TodoList = () => {
    const useStores = React.useContext(RootStoresContext);

    const todoStore = useStores.todoStore;

    const [text, setText] = React.useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setText(value)
    }

    const handleSubmit = ()=>{
        todoStore.addTodo(text);
        setText("")
    }

    return (
        <>
            <div className="row">
                <table className="table table-hover">
                    <input type="text" onChange={handleChange} value={text} placeholder="todo"/>
                    <button onClick={handleSubmit} type='button'>Add</button>
                    <thead className="thead-light">
                        <tr>
                            <th>Title</th>
                            <th>Completed?</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todoStore.todos.map((todo: any) => (
                            <tr key={todo.id}>
                                <td>{todo.title}</td>
                                <td>{todo.completed ? "done" : "x"}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-info"
                                        onClick={() => todoStore.toggleTodo(todo.id!)}
                                    >
                                        Toggle
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => todoStore.removeTodo(todo.id!)}
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