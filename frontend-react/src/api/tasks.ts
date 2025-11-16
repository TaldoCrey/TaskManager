import axios from "axios";
import type { Task } from "../Components/types";

const API_URL = "https://taskmanager-api-zcdc.onrender.com/v1/tasks"

export async function getTaskById(id: string) {
    try {
        const response = await axios.get(`${API_URL}/${id}`)

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
        const response = await axios.post(API_URL, postData);

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
        const response = await axios.put(`${API_URL}/${task.id}`, putData);

        console.log("Response:", response);
        return response;
    } catch (error) {
        console.error("Erro em updateTask:", error);
    }
}

export async function deleteTaskById(id: string) {
    try {
        const response = await axios.delete(`${API_URL}/${id}`)

        console.log("Data arrived: ", response.data);
        return response;
    } catch (error) {
        console.error("Erro em deleteTaskById:", error);
    }
}