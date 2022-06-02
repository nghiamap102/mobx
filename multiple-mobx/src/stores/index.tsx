import { configure } from "mobx";
import React from "react";
import AnimalStore from "./animalStore";
import NoteStore from "./noteStore";
import TodoStore from "./todoStore";
import UserStore from "./userStore";
export class RootStore {
    
    userStore: UserStore
    noteStore: NoteStore
    animalStore: AnimalStore
    todoStore : TodoStore
    constructor() {
        this.userStore = new UserStore(this);
        this.noteStore = new NoteStore(this);
        this.animalStore = new AnimalStore('gary');
        this.todoStore = new TodoStore();
        configure({
            useProxies: "never",
            computedRequiresReaction: true
        })
    }
    
}

export const StoresContext = React.createContext(new RootStore());

