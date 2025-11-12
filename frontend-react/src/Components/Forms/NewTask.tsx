import styles from "./Form.module.css"
import CloseTaskBtn from "../CloseTaskBtn/CloseTaskBtn";
import TaskInput from "../Inputs/TaskInput";
import PriorityDropdown from "../PriorityDropdown/PriorityDropdown";
import TextBox from "../TextBox/TextBox";
import type { Task } from "../types";
import { useState } from "react";

type props = {
    formhandler: (data: Task | null, exit_call: number) => void;
}

function NewTask({formhandler}: props) {

    const [date, setDate] = useState(new Date());
    const [nameState, setNS] = useState("")
    const [descState, setDS] = useState("")
    const [priorityState, setPS] = useState("Baixa Prioridade");

    const handleInput = (data: string) => {
        setNS(data);
    } 

    const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parts = e.target.value.split('-').map(part => parseInt(part, 10));

        const dateObject = new Date(parts[0], parts[1] - 1, parts[2]);
        setDate(dt => dt = dateObject);
    }

    const handleDrop = (data: string) => {
        setPS(data);
    }

    const handleText = (data: string) => {
        setDS(data);
    }

    const associateFormData = () => {
        let tsk: Task = {name: nameState, description: descState, priority: priorityState, date, id: -1, finished: false};
        formhandler(tsk, 0);
    }

    return(
        <div className={styles.form}>
            <div onClick={() => formhandler(null, 1)}>
                <CloseTaskBtn/>
            </div>
            
            <div className="w-[474px] h-[606px] flex flex-col space-y-[10px] items-center">
                <TaskInput placeholder="Qual tarefa você precisa realizar?" sendBack={handleInput}/>
                <hr className="border-0.5 border-bgLight w-[450px]"/>
                <div className="flex flex-row justify-between w-[450px] items-center">
                    <p className="text-white font-semibold">Data de conclusão:</p>
                    <input className={styles.datebutton} type="date" onChange={(e) => handleDate(e)}/>
                </div>
                <div className="flex flex-row justify-between w-[450px] items-center">
                    <p className="text-white font-semibold">Prioridade:</p>
                    <PriorityDropdown CurrPriority="Baixa Prioridade" sendBack={handleDrop}/>
                </div>
                <hr className="border-0.5 border-bgLight w-[450px]"/>
                <p className="text-white font-semibold">Descrição:</p>
                <TextBox text="" sendBack={handleText}/>
                <hr className="border-0.5 border-bgLight w-[450px]"/>
                <button className="flex space-x-[8px] items-center justify-center bg-lowPrio 
                w-[150px] h-[36px] rounded-[4px] duration-300 ease-out hover:brightness-75"
                onClick={associateFormData}>
                    <img src="/confirmicon.svg"></img>
                    <p className="text-lowPrioText">Criar Task</p>
                </button>
                
            </div>
        </div>
    );
    
}

export default NewTask