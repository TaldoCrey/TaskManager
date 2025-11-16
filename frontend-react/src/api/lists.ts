import axios from "axios";
import type { TaskList } from "../Components/types";

const API_URL = "https://taskmanager-api-zcdc.onrender.com/v1/lists"

export async function getLists() {
    try {
        const response = await axios.get(API_URL)

        console.log("Data arrived: ", response);
        return response.data;
    } catch (error) {
        console.log("Erro em getLists: ", error);
    }
}

export async function getListById(id: "string") {
    try {
        const response = await axios.get(`${API_URL}/${id}`)

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
        const response = await axios.post(API_URL, postData);

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
        const response = await axios.put(`${API_URL}/${list.id}`, postData)

        console.log("Data arrived: ", response);
        return response;
    } catch (error) {
        console.log("Erro em editList: ", error);
    }
}

export async function deleteListById(id: string) {
    try {
        const response = await axios.delete(`${API_URL}/${id}`)

        console.log("Data arrived: ", response);
        return response;
    } catch (error) {
        console.log("Erro em deleteListById: ", error);
    }
}