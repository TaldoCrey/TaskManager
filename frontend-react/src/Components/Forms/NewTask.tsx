import styles from "./Form.module.css"
import CloseTaskBtn from "../CloseTaskBtn/CloseTaskBtn";
import TaskInput from "../Inputs/TaskInput";
import PriorityDropdown from "../PriorityDropdown/PriorityDropdown";
import TextBox from "../TextBox/TextBox";
import type { Task, TaskList } from "../types";
import { useContext, useState } from "react";
import { createTaskContext, inputContext, type InputContext } from "../contexts";
import { Input } from "postcss";

function NewTask() {

    const [date, setDate] = useState(new Date());
    const [name, setNS] = useState("")
    const [description, setDS] = useState("")
    const [priority, setPS] = useState("LOW");

    const cTaskContext = useContext(createTaskContext);

    const {sendTask} = cTaskContext;

    const inputContextValue: InputContext = {
        handleInfo: (info: any, type: string) => {
            switch(type) {
                case "TaskInput":
                    setNS(info);
                    break;
                case "PriorityDropdown":
                    setPS(info);
                    break;
                case "TextBox":
                    setDS(info);
                    break;
            }
        }
    }

    const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parts = e.target.value.split('-').map(part => parseInt(part, 10));

        const dateObject = new Date(parts[0], parts[1] - 1, parts[2]);
        setDate(dt => dt = dateObject);
    }

    const assembleInfo = () => {
        let task: Task = {name, description, id:"", date, priority, finished: false}
        sendTask(task);
    }

    return(
        <div className={styles.form}>
            <div onClick={() => sendTask(null)} className="w-fit h-fit">
                <CloseTaskBtn/>
            </div>
            
            <div className="w-[474px] h-[606px] flex flex-col space-y-[10px] items-center">
                <inputContext.Provider value={inputContextValue}>
                <TaskInput placeholder="Qual tarefa você precisa realizar?" />
                </inputContext.Provider>
                <hr className="border-0.5 border-bgLight w-[450px]"/>
                <div className="flex flex-row justify-between w-[450px] items-center">
                    <p className="text-white font-semibold">Data de conclusão:</p>
                    <input className={styles.datebutton} type="date" onChange={(e) => handleDate(e)}/>
                </div>
                <div className="flex flex-row justify-between w-[450px] items-center">
                    <p className="text-white font-semibold">Prioridade:</p>
                    <inputContext.Provider value={inputContextValue}>
                    <PriorityDropdown CurrPriority="LOW" />
                    </inputContext.Provider>
                </div>
                <hr className="border-0.5 border-bgLight w-[450px]"/>
                <p className="text-white font-semibold">Descrição:</p>
                <inputContext.Provider value={inputContextValue}>
                <TextBox text="" />
                </inputContext.Provider>
                <hr className="border-0.5 border-bgLight w-[450px]"/>
                <button className="flex space-x-[8px] items-center justify-center bg-lowPrio 
                w-[150px] h-[36px] rounded-[4px] duration-300 ease-out hover:brightness-75"
                onClick={assembleInfo}>
                    <img src="/confirmicon.svg"></img>
                    <p className="text-lowPrioText">Criar Task</p>
                </button>
                
            </div>
        </div>
    );
    
}

export default NewTask