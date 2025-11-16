import React, {createContext} from 'react';
import type { Task, TaskList } from './types';

export interface UpdateTaskContext {
    task: Task;
    setTask: (t: Task | null) => void;
}

export const updateTaskContext = createContext<UpdateTaskContext>({task: {
    name:"",
    description:"",
    date: new Date(),
    priority: "",
    id: "",
    finished: false
}, setTask: () => {}})

export interface UpdateListContext {
    list: TaskList;
    setList: (l: TaskList | null) => void;
}

export const updateListContext = createContext<UpdateListContext>({list: {
    title: "",
    id: "",
    tasklist: []
}, setList: () => {}})

export interface CreateTaskContext {
    sendTask: (t: Task | null) => void;
}

export const createTaskContext = createContext<CreateTaskContext>({sendTask: () => {}});

export interface CreateListContext {
    sendList: (l: TaskList | null) => void;
}

export const createListContext = createContext<CreateListContext>({sendList: () => {}})

export interface InputContext {
    handleInfo: (info: any, type: string) => void;
}

export const inputContext = createContext<InputContext>({handleInfo: () => {}})

export interface TaskListContext {
    setState: (state: string, info: any) => void;
}

export const taskListContext = createContext<TaskListContext>({setState: () => {}})

export interface ModalContext {
    setState: (state:boolean) => void;
}

export const modalContext = createContext<ModalContext>({setState: () => {}})



