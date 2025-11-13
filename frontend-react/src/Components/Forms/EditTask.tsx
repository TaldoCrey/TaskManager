import styles from "./Form.module.css"
import CloseTaskBtn from "../CloseTaskBtn/CloseTaskBtn";
import TaskInput from "../Inputs/TaskInput";
import PriorityDropdown from "../PriorityDropdown/PriorityDropdown";
import TextBox from "../TextBox/TextBox";
import React, { forwardRef, useRef, useState } from "react";
import type {Task} from "../types.ts"

type BtnProps = {
    value?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

type props = {
    taskinfo: Task,
}

function EditTask({taskinfo}: props) {

    const [taskInfo, setTaskInfo] = useState<Task>(taskinfo)
    const [nameState, setNS] = useState(taskinfo.name)
    const [descState, setDS] = useState(taskinfo.description)
    const [dateState, setDTS] = useState(taskinfo.date)
    const [priorityState, setPS] = useState(taskinfo.priority);


    const handleDrop = (data: string) => {
        setPS(p => p = data);
    }

    const handleInput = (data:string) => {
        setNS(n => n = data)
    }

    const handleTA = (data: string) => {
        setDS(d => d = data)
    }

    const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parts = e.target.value.split('-').map(part => parseInt(part, 10));
    
        const dateObject = new Date(parts[0], parts[1] - 1, parts[2]);
        setDTS(dt => dt = dateObject)
    }

    return(
        <div className={styles.form}>
            <div>
            <CloseTaskBtn/>
            </div>
            <div className="w-[474px] h-[606px] flex flex-col space-y-[10px] items-center">
                <TaskInput placeholder={nameState}/>
                <hr className="border-0.5 border-bgLight w-[450px]"/>
                <div className="flex flex-row justify-between w-[450px] items-center">
                    <p className="text-white font-semibold">Data de conclusão: {taskinfo.date.getDay()}/{taskinfo.date.getMonth()}/{taskinfo.date.getFullYear()}</p>
                    <input className={styles.datebutton} type="date" onChange={handleDate}/>
                </div>
                <div className="flex flex-row justify-between w-[450px] items-center">
                    <p className="text-white font-semibold">Prioridade:</p>
                    <PriorityDropdown CurrPriority={taskinfo.priority} />
                </div>
                <hr className="border-0.5 border-bgLight w-[450px]"/>
                <p className="text-white font-semibold">Descrição:</p>
                <TextBox text={taskinfo.description} />
                <hr className="border-0.5 border-bgLight w-[450px]"/>
                <button className="flex space-x-[8px] items-center justify-center bg-lowPrio 
                w-[150px] h-[36px] rounded-[4px] duration-300 ease-out hover:brightness-75"
                >
                    <img src="/confirmicon.svg"></img>
                    <p className="text-lowPrioText">Editar Task</p>
                </button>
                
            </div>
        </div>
    );
    
}

export default EditTask