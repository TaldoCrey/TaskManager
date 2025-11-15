import styles from "./TaskCard.module.css"
import React, {useEffect, useState, useRef, useContext} from 'react'
import type {Task, TaskList} from "../types.ts"
import { useDraggable } from "@dnd-kit/core";
import { taskListContext } from "../contexts.ts";

type menuProperties = {
    visible: boolean;
    x: number;
    y: number;
}

type props = {
    taskinfo: Task,
    listindex: string
}

function TaskCard({taskinfo, listindex}: props) {

    const [isLate, setLateState] = useState(false);
    const [taskCardStyle, setTKStyle] = useState(styles.taskcard);
    const [dateButtonStyle, setDBStyle] = useState(styles.datebutton);
    const [priorityTagStyle, setPTStyle] = useState(styles.lowprioritytag);
    const [menu, setMenu] = useState<menuProperties>({visible: false, x: 0, y: 0});
    const [finishSVG, setFinishSVG] = useState("/FinishTaskButton.svg")
    const [dateSVG, setDateSVG] = useState("/dateicon.svg");
    const [priorityText, setPText] = useState("");
    
    const menuRef = useRef<HTMLDivElement>(null);
    const TaskListContext = useContext(taskListContext);
    const {setState} = TaskListContext;

    const {attributes, listeners, setNodeRef, transform} = useDraggable({id: taskinfo.id});

    const DragStyle = transform ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`
    } : undefined;

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setMenu({visible: true, x:e.clientX, y:e.clientY});
    }

    const handleCloseMenu = () => {
        setMenu(m => m = {...m, visible: false});
    }

    useEffect(() => {
        if (!menu.visible) {
            return;
        }

        if (isLate) {
            setTKStyle(styles.latetaskcardlock);
        } else {
            setTKStyle(styles.taskcardlock);
        }

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                handleCloseMenu();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (isLate) {
                setTKStyle(styles.latetaskcard);
                if (taskinfo.finished) {
                    setTKStyle(styles.finishedlatetaskcard)
                }
            } else {
                setTKStyle(styles.taskcard);
                if (taskinfo.finished) {
                    setTKStyle(styles.finishedtaskcard)
                }
                
            }
        }

    }, [menu.visible])

    useEffect(() => {
        if (isLate) {
            setTKStyle(styles.latetaskcard);
            setDBStyle(styles.latedatebutton);
            setDateSVG("/latedateicon.svg");
        }

        if (taskinfo.finished) {
            if (isLate) {
                setTKStyle(styles.finishedlatetaskcard)
             } else {
                setTKStyle(styles.finishedtaskcard);
             }
            setFinishSVG("/FinishedTaskButton.svg");
        }
    }, [isLate, taskinfo.finished]);


    useEffect(() => {
        switch (taskinfo.priority) {
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
    }, [taskinfo.priority])

    return(
        <div>
            <div className={taskCardStyle} onContextMenu={handleContextMenu} 
            ref={setNodeRef} {...listeners} {...attributes} style={DragStyle}>
                <div className="w-[429px] h-[40px] flex justify-between items-center">
                    <div className={priorityTagStyle}>
                        {priorityText}
                    </div>
                    <button onDoubleClick={() => setState("FINISHED", {task:{...taskinfo, finished: true}, listIndex: listindex, taskIndex: taskinfo.id})}>
                        <img src={finishSVG} alt="Finish task Button Image"></img>
                    </button>
                </div>
                <div className="w-[429px] h-[105px] flex flex-col space-y-[2px]">
                    <h2 className="w-fill h-[29px] text-white"><b>{taskinfo.name}</b></h2>
                    <p className="w-fill h-[105px] overflow-hidden text-ellipsis text-white">
                        {taskinfo.description}
                    </p>
                </div>
                <div className={dateButtonStyle} >
                    <img src={dateSVG} className="w-[16px] h-[16px] mr-[5px] ml-[10px]"></img>
                    {taskinfo.date.getDate()}, {taskinfo.date.getMonth()} {taskinfo.date.getFullYear()}
                </div>
            </div>

            {menu.visible && (
                <div ref={menuRef} style={{position: 'fixed', top:`${menu.y}px`, left: `${menu.x}px`, zIndex:1000}} className={styles.menu}>
                    <ul className="py-[8px] px-[1px]">
                        <li onClick={() => {handleCloseMenu(); setState("EDIT_TASK", {task: taskinfo, listIndex: listindex, taskIndex: taskinfo.id})}}
                        className="w-fill h-[40px] text-white text-[16px] flex items-center
                        duration-300 ease-out hover:bg-bgLight">
                            <img src="/editicon.svg" className="w-[16px] h-[16px] mr-[5px] ml-[10px]"></img>
                            Editar
                        </li>
                        <li onClick={() => {handleCloseMenu(); setState("DUPE_TASK", {task: {...taskinfo, id:"", finished: false}, listIndex: listindex})}}
                        className="w-fill h-[40px] text-white text-[16px] flex items-center
                        duration-300 ease-out hover:bg-gray">
                            <img src="/dupeicon.svg" className="w-[16px] h-[16px] mr-[5px] ml-[10px]"></img>
                            Duplicar
                        </li>
                        <li onClick={() => {handleCloseMenu(); setState("DEL_TASK", {taskId: taskinfo.id, listId: listindex, taskName: taskinfo.name})}}
                        className="w-fill h-[40px] text-[#AF0505] text-[16px] flex items-center
                        duration-300 ease-out hover:bg-bgLight">
                            <img src="/delicon.svg" className="w-[16px] h-[16px] mr-[5px] ml-[10px]"></img>
                            Deletar
                        </li>
                    </ul>
                </div>
            )}
        </div>

    );
}

export default TaskCard