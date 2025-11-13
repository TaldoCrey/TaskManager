import styles from "./TaskCard.module.css"
import React, {useEffect, useState, useRef} from 'react'
import type {Task, TaskList} from "../types.ts"
import { useDraggable } from "@dnd-kit/core";

type menuProperties = {
    visible: boolean;
    x: number;
    y: number;
}

type props = {
    taskinfo: Task,
}

function TaskCard({taskinfo}: props) {

    const [isLate, setLateState] = useState(false);
    const [taskCardStyle, setTKStyle] = useState(styles.taskcard);
    const [dateButtonStyle, setDBStyle] = useState(styles.datebutton);
    const [priority, setPriority] = useState(taskinfo.priority);
    const [priorityTagStyle, setPTStyle] = useState(styles.lowprioritytag);
    const [menu, setMenu] = useState<menuProperties>({visible: false, x: 0, y: 0});
    const [isFinished, setFinishState] = useState(taskinfo.finished);
    const [finishSVG, setFinishSVG] = useState("/FinishTaskButton.svg")
    const [dateSVG, setDateSVG] = useState("/dateicon.svg");
    const [taskdata, setTaskData] = useState<Task>(taskinfo);
    
    const menuRef = useRef<HTMLDivElement>(null);


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
            } else {
                setTKStyle(styles.taskcard);
            }
        }

    }, [menu.visible])

    useEffect(() => {
        if (isLate) {
            setTKStyle(styles.latetaskcard);
            setDBStyle(styles.latedatebutton);
            setDateSVG("/latedateicon.svg");
        }

        if (isFinished) {
            if (isLate) {
                setTKStyle(styles.finishedlatetaskcard)
             } else {
                setTKStyle(styles.finishedtaskcard);
             }
            setFinishSVG("/FinishedTaskButton.svg");
        }
    }, [isLate, isFinished]);


    useEffect(() => {
        switch (priority) {
            case "Baixa Prioridade":
                setPTStyle(styles.lowprioritytag);
                break;
            case "Média Prioridade":
                setPTStyle(styles.midprioritytag);
                break;
            case "Alta Prioridade":
                setPTStyle(styles.highprioritytag);
                break;
            case "Altíssima Prioridade":
                setPTStyle(styles.veryhighprioritytag);
                break;
        }
    }, [priority])

    return(
        <div>
            <div className={taskCardStyle} onContextMenu={handleContextMenu} 
            ref={setNodeRef} {...listeners} {...attributes} style={DragStyle}>
                <div className="w-[429px] h-[40px] flex justify-between items-center">
                    <div className={priorityTagStyle}>
                        {priority}
                    </div>
                    <button onClick={() => setFinishState(true)}>
                        <img src={finishSVG} alt="Finish task Button Image"></img>
                    </button>
                </div>
                <div className="w-[429px] h-[105px] flex flex-col space-y-[2px]">
                    <h2 className="w-fill h-[29px] text-white"><b>{taskdata.name}</b></h2>
                    <p className="w-fill h-[105px] overflow-hidden text-ellipsis text-white">
                        {taskdata.description}
                    </p>
                </div>
                <div className={dateButtonStyle} >
                    <img src={dateSVG} className="w-[16px] h-[16px] mr-[5px] ml-[10px]"></img>
                    {taskdata.date.getDate()}, {taskdata.date.getMonth()} {taskdata.date.getFullYear()}
                </div>
            </div>

            {menu.visible && (
                <div ref={menuRef} style={{position: 'fixed', top:`${menu.y}px`, left: `${menu.x}px`, zIndex:1000}} className={styles.menu}>
                    <ul className="py-[8px] px-[1px]">
                        <li onClick={() => {handleCloseMenu(); }}
                        className="w-fill h-[40px] text-white text-[16px] flex items-center
                        duration-300 ease-out hover:bg-bgLight">
                            <img src="/editicon.svg" className="w-[16px] h-[16px] mr-[5px] ml-[10px]"></img>
                            Editar
                        </li>
                        <li onClick={() => {handleCloseMenu(); }}
                        className="w-fill h-[40px] text-white text-[16px] flex items-center
                        duration-300 ease-out hover:bg-gray">
                            <img src="/dupeicon.svg" className="w-[16px] h-[16px] mr-[5px] ml-[10px]"></img>
                            Duplicar
                        </li>
                        <li onClick={() => {handleCloseMenu(); }}
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