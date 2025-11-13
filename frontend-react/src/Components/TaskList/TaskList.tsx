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
}  

function TaskListC({list, index,}:props) {

    const {setNodeRef} = useDroppable({id: index});

    return(
    <div className={styles.list}>
        <ListTitle title={list.title} />
        <ul className={styles.tasks} ref={setNodeRef}>
        {list.tasklist.map((task: Task, taskIndex: number) => {
            return <li key={task.id}>
            <TaskCard taskinfo={task} />
            </li>
        })}
        <li className="w-fit" >
            <NewThingBtn label="Nova Tarefa"/>
        </li>
        </ul>
    </div>
    );
}

export default TaskListC