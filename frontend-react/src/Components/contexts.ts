import React, {createContext} from 'react';
import type { Task, TaskList } from './types';

export interface TaskContext {
    task: Task;
    setTask: (t: Task) => void;
}

export interface ListContext {
    list: TaskList;
    setList: (l: TaskList) => void;
}

