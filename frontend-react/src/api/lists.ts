import type { TaskList } from "../Components/types";
import api from './axios.ts'

export async function getLists() {
    try {
        const response = await api.get(`/v1/lists`)

        console.log("Data arrived: ", response);
        return response.data;
    } catch (error) {
        console.log("Erro em getLists: ", error);
    }
}

export async function getListById(id: "string") {
    try {
        const response = await api.get(`/v1/lists/${id}`)

        console.log("Data arrived: ", response);
        return response.data;
    } catch (error) {
        console.log("Erro em getListById: ", error);
    }
}

export async function createList(list: TaskList) {
    const postData = {
        listname: list.title
    }
    try {
        const response = await api.post(`/v1/lists`, postData);

        console.log("Data arrived: ", response);
        return response;
    } catch (error) {
        console.log("Erro em createList: ", error);
    }
}

export async function editList(list: TaskList) {
    const postData = {
        listname: list.title
    }
    try {
        const response = await api.put(`/v1/lists/${list.id}`, postData)

        console.log("Data arrived: ", response);
        return response;
    } catch (error) {
        console.log("Erro em editList: ", error);
    }
}

export async function deleteListById(id: string) {
    try {
        const response = await api.delete(`/v1/lists/${id}`)

        console.log("Data arrived: ", response);
        return response;
    } catch (error) {
        console.log("Erro em deleteListById: ", error);
    }
}