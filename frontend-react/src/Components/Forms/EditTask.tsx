import styles from "./Form.module.css"
import CloseTaskBtn from "../CloseTaskBtn/CloseTaskBtn";
import TaskInput from "../Inputs/TaskInput";
import PriorityDropdown from "../PriorityDropdown/PriorityDropdown";
import TextBox from "../TextBox/TextBox";
import React, { forwardRef, useContext, useRef, useState } from "react";
import type {Task} from "../types.ts"
import { inputContext, updateTaskContext, type InputContext } from "../contexts.ts";

type BtnProps = {
    value?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function EditTask() {

    const editTaskContext = useContext(updateTaskContext);
    const {task, setTask} = editTaskContext;

    const [date, setDate] = useState(task.date);
    const [name, setNS] = useState(task.name)
    const [description, setDS] = useState(task.description)
    const [priority, setPS] = useState(task.priority);

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
        let finalTask: Task = {name, description, id: task.id, date, priority, finished: task.finished}
        setTask(finalTask);
    }

    return(
        <div className={styles.form}>
            <div onClick={() => setTask(null)} className="w-fit h-fit">
            <CloseTaskBtn/>
            </div>
            <div className="w-[474px] h-[606px] flex flex-col space-y-[10px] items-center">
                <inputContext.Provider value={inputContextValue}>
                <TaskInput placeholder={task.name}/>
                </inputContext.Provider>
                <hr className="border-0.5 border-bgLight w-[450px]"/>
                <div className="flex flex-row justify-between w-[450px] items-center">
                    <p className="text-white font-semibold">Data de conclusão: {task.date.getDay()}/{task.date.getMonth()}/{task.date.getFullYear()}</p>
                    <input className={styles.datebutton} type="date" onChange={handleDate}/>
                </div>
                <div className="flex flex-row justify-between w-[450px] items-center">
                    <p className="text-white font-semibold">Prioridade:</p>
                    <inputContext.Provider value={inputContextValue}>
                    <PriorityDropdown CurrPriority={task.priority} />
                    </inputContext.Provider>
                </div>
                <hr className="border-0.5 border-bgLight w-[450px]"/>
                <p className="text-white font-semibold">Descrição:</p>
                <inputContext.Provider value={inputContextValue}>
                <TextBox text={task.description} />
                </inputContext.Provider>
                <hr className="border-0.5 border-bgLight w-[450px]"/>
                <button className="flex space-x-[8px] items-center justify-center bg-lowPrio 
                w-[150px] h-[36px] rounded-[4px] duration-300 ease-out hover:brightness-75"
                onClick={assembleInfo}>
                    <img src="/confirmicon.svg"></img>
                    <p className="text-lowPrioText">Editar Task</p>
                </button>
                
            </div>
        </div>
    );
    
}

export default EditTask