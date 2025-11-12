import styles from "./TaskList.module.css";
import ListTitle from "../ListTitle/ListTitle";
import NewThingBtn from "../NewThingBtn/NewThingBtn";
import TaskCard from "../TaskCard/TaskCard";
import type {TaskList, Task} from "../types.ts"
import { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";

type props = {
    list: TaskList,
    index: number,
    listSendBack: ({i, data}:{i: number, data: string}) => void;
    taskSendBack: (
        tb: {i:number, ti:number, data:string},
        fb: {i_f:number, ti_f:number, data_f:boolean}) => void;
    nTaskSendBack: ({ntlid, snt}:{ntlid:number, snt:boolean}) => void;
}  

function TaskListC({list, index, listSendBack, taskSendBack, nTaskSendBack}:props) {

    const [FTDt, setFTDt] = useState<{i_f:number, ti_f:number, data_f:boolean}>({i_f: 0, ti_f: 0, data_f: false});
    const [COCDt, setCOCDt] = useState<{i:number, ti:number, data:string}>({i: 0, ti: 0, data: ""});

    const {setNodeRef} = useDroppable({id: index});

    useEffect(() => {
        taskSendBack(COCDt, FTDt);
    }, [FTDt, COCDt])

    return(
    <div className={styles.list}>
        <ListTitle title={list.title} listMenuHandler={(data) => listSendBack({i: index, data})}/>
        <ul className={styles.tasks} ref={setNodeRef}>
        {list.tasklist.map((task: Task, taskIndex: number) => {
            return <li key={task.id}>
            <TaskCard taskinfo={task} menuChoice={(dataDoForm) => setCOCDt({i: index, ti: taskIndex, data: dataDoForm})}
                finished={(data) => setFTDt({i_f: index, ti_f: taskIndex, data_f: data})}/>
            </li>
        })}
        <li className="w-fit" onClick={() => nTaskSendBack({ntlid:index, snt: true})}>
            <NewThingBtn label="Nova Tarefa"/>
        </li>
        </ul>
    </div>
    );
}

export default TaskListC