import styles from "./TaskList.module.css";
import ListTitle from "../ListTitle/ListTitle";
import NewThingBtn from "../NewThingBtn/NewThingBtn";
import TaskCard from "../TaskCard/TaskCard";
import type {TaskList, Task} from "../types.ts"
import { useContext, useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { taskListContext } from "../contexts.ts";

type props = {
    list: TaskList,
    index: number,
}  

function TaskListC({list, index}:props) {

    const {setNodeRef} = useDroppable({id: index});

    const TaskListContext = useContext(taskListContext);
    const {setState} = TaskListContext;

    return(
    <div className={styles.list}>
        <ListTitle title={list.title} listId={list.id}/>
        <ul className={styles.tasks} ref={setNodeRef}>
        {list.tasklist.map((task: Task, taskIndex: number) => {
            return <li key={task.id}>
            <TaskCard taskinfo={task} listindex={list.id}/>
            </li>
        })}
        <li className="w-fit" onClick={() => setState("NEW_TASK", list.id)}>
            <NewThingBtn label="Nova Tarefa"/>
        </li>
        </ul>
    </div>
    );
}

export default TaskListC