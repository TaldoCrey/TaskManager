import type { Task } from "../Components/types";
import api from './axios.ts';

export async function getTaskById(id: string) {
    try {
        const response = await api.get(`/v1/tasks/${id}`)

        console.log("Data arrived: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Erro em getTaskById:", error);
    }
}

export async function createTask(task: Task, listId: string) {
    const postData = {
        taskname: task.name,
        description: task.description,
        priority: task.priority,
        expectedFinishDate: task.date,
        listId: listId
    };
    try {
        const response = await api.post(`/v1/tasks`, postData);

        console.log("Response:", response);
        return response.data;
    } catch (error) {
        console.error("Erro em createTask:", error);
    }
}

export async function updateTask(task: Task, finish: boolean, listId: string) {
    let putData;
    if (finish) {
        putData = {
        taskName: task.name,
        description: task.description,
        priority: task.priority,
        expectedFinishDate: task.date,
        finishDate: `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
    };
    } else {
        putData = {
            taskName: task.name,
            description: task.description,
            priority: task.priority,
            expectedFinishDate: task.date,
        };
    }
    if (listId != "") {
        putData = {...putData, listId: listId};
    }
    try {
        const response = await api.put(`/v1/tasks/${task.id}`, putData);

        console.log("Response:", response);
        return response;
    } catch (error) {
        console.error("Erro em updateTask:", error);
    }
}

export async function deleteTaskById(id: string) {
    try {
        const response = await api.delete(`/v1/tasks/${id}`)

        console.log("Data arrived: ", response.data);
        return response;
    } catch (error) {
        console.error("Erro em deleteTaskById:", error);
    }
}