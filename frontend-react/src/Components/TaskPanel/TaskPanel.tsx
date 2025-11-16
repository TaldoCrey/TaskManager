import styles from "./TaskPanel.module.css"
import CloseTaskBtn from "../CloseTaskBtn/CloseTaskBtn";
import TaskInput from "../Inputs/TaskInput";
import PriorityDropdown from "../PriorityDropdown/PriorityDropdown";
import TextBox from "../TextBox/TextBox";
import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import type {Task} from "../types.ts"
import { inputContext, taskListContext, updateTaskContext, type InputContext } from "../contexts.ts";

type BtnProps = {
    value?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

type props = {
    task: Task;
    listId: string
}

function TaskPanel({task, listId}: props) {

    const TaskListContext = useContext(taskListContext);
    const {setState} = TaskListContext;

    const [dateSVG, setDateSVG] = useState("/dateicon.svg");
    const [dateButtonStyle, setDBStyle] = useState(styles.datebutton);
    const [finishSVG, setFinishSVG] = useState("/FinishTaskButton.svg")
    const [priorityTagStyle, setPTStyle] = useState(styles.lowprioritytag);
    const [priorityText, setPText] = useState("");
    const [isLate, setLateState] = useState(false);

    useEffect(() => {
        switch (task.priority) {
            case "LOW":
                setPTStyle(styles.lowprioritytag);
                setPText("Baixa Prioridade");
                break;
            case "MEDIUM":
                setPTStyle(styles.midprioritytag);
                setPText("Média Prioridade");
                break;
            case "HIGH":
                setPTStyle(styles.highprioritytag);
                setPText("Alta Prioridade");
                break;
            case "VERY_HIGH":
                setPTStyle(styles.veryhighprioritytag);
                setPText("Altíssima Prioridade");
                break;
        }
    }, [task.priority])

    useEffect(() => {

        let now = new Date();
        if (now.getFullYear() > task.date.getFullYear()) {
            setLateState(true);
        }

        if (now.getMonth() > task.date.getMonth()) {
            setLateState(true);
        }

        if (now.getDate() > task.date.getDate()) {
            setLateState(true);
        }

    }, [task.date])

    useEffect(() => {
        if (isLate) {
            setDBStyle(styles.latedatebutton);
            setDateSVG("/latedateicon.svg");
        }

        if (task.finished) {
            setFinishSVG("/FinishedTaskButton.svg");
        }
    }, [isLate, task.finished]);

    return(
        <div className={styles.form}>
            <div className="w-[95%] max-md:w-[90%] h-fit items-start flex justify-between">
                <div onClick={() => setState("EXIT", null)} className="w-fit h-fit">
                    <CloseTaskBtn/>
                </div>
                <button onClick={() => {setFinishSVG("/FinishedTaskButton.svg"); setState("FINISHED", {task:{...task, finished: true}, listIndex: listId, taskIndex: task.id})}}>
                    <img src={finishSVG} alt="Finish task Button Image"></img>
                </button>
            </div>
            <div className="w-[474px] max-md:w-[370px] h-[606px] flex flex-col space-y-[10px] items-center">
                <p className="text-white font-bold text-[26px]">{task.name}</p>
                <hr className="border-0.5 border-bgLight w-[450px] max-md:w-[370px]"/>
                <div className="flex flex-row justify-between w-[450px] max-md:w-[370px] items-center">
                    <p className="text-white font-semibold">Data:</p>
                    <div className={dateButtonStyle} >
                        <img src={dateSVG} className="w-[16px] h-[16px] mr-[5px] ml-[10px]"></img>
                        {task.date.getDate()}, {task.date.toDateString().split(" ")[1].toUpperCase()} {task.date.getFullYear()}
                    </div>
                </div>
                <div className="flex flex-row justify-between w-[450px] max-md:w-[370px] items-center">
                    <p className="text-white font-semibold">Prioridade:</p>
                    <div className={priorityTagStyle}>
                        {priorityText}
                    </div>
                </div>
                <hr className="border-0.5 border-bgLight w-[450px] max-md:w-[370px]"/>
                <p className="text-white font-semibold">Descrição:</p>
                <p className="w-[450px] max-md:w-[370px] h-[105px] text-white text-start">
                    {task.description}
                </p>
                <hr className="border-0.5 border-bgLight w-[450px] max-md:w-[370px]"/>
                <button className="flex justify-center items-center p-[8px] w-fit h-fit space-x-[8px] ml-3
                duration-200 ease-in-out hover:bg-bgLight rounded-[10px]"
                onClick={() => setState("DEL_TASK", {taskId: task.id, listId, taskName: task.name})}>
                    <img src="/delicon.svg"></img>
                    <p className="text-[#AF0505]">Deletar</p>
                </button>
                
            </div>
        </div>
    );
}

export default TaskPanel