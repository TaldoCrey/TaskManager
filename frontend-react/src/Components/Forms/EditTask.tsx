import styles from "./Form.module.css"
import CloseTaskBtn from "../CloseTaskBtn/CloseTaskBtn";
import TaskInput from "../Inputs/TaskInput";
import PriorityDropdown from "../PriorityDropdown/PriorityDropdown";
import TextBox from "../TextBox/TextBox";
import React, { forwardRef, useContext, useRef, useState } from "react";
import type {Task} from "../types.ts"
import { inputContext, modalContext, updateTaskContext, type InputContext, type ModalContext } from "../contexts.ts";
import { AnimatePresence, motion } from "framer-motion";
import DenialModal from "../Modals/DenialModal.tsx";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

type BtnProps = {
    value?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

type refProps = {
    value?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    path: string;
}

const CustomDateButton = forwardRef<HTMLButtonElement, refProps>(({value, onClick, path}, ref) => {
    if (!value) {
        return
    }
    const parts = value.split('/').map(part => parseInt(part, 10));
    const dateObject = new Date(parts[2], parts[0] - 1, parts[1]);
    return <button className={styles.datebutton} onClick={onClick} ref={ref}>
        <img src={path}></img>
        <p>{dateObject.getDate()}, {dateObject.toDateString().split(" ")[1].toUpperCase()} {dateObject.getFullYear()}</p>
    </button>
})

function EditTask() {

    const editTaskContext = useContext(updateTaskContext);
    const {task, setTask} = editTaskContext;

    const [date, setDate] = useState(task.date);
    const [name, setNS] = useState(task.name)
    const [description, setDS] = useState(task.description)
    const [priority, setPS] = useState(task.priority);
    const [denial, setDenialModal] = useState(false);
    const [modalText, setModalText] = useState("");

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

    const modalDenContextValue: ModalContext = {
        setState: setDenialModal
    }

    const handleDate = (e:any) => {
        setDate(dt => dt = e);
    }

    const assembleInfo = () => {
        if (name.trim() == "") {
            setModalText("O Nome da task é obrigatório!");
            setDenialModal(true);
            return;
        }

        if (!date) {
            setModalText("A data de conclusão é obrigatória!");
            setDenialModal(true);
            return;
        }

        const now = new Date();

        if (now.getFullYear() > date.getFullYear()) {
            setModalText("A data deve ser futura!");
            setDenialModal(true);
            return;
        }

        if (now.getMonth() > date.getMonth()) {
            setModalText("A data deve ser futura!");
            setDenialModal(true);
            return;
        }

        if (now.getDate() > date.getDate()) {
            setModalText("A data deve ser futura!");
            setDenialModal(true);
            return;
        }
        let finalTask: Task = {name, description, id: task.id, date, priority, finished: task.finished}
        setTask(finalTask);
    }

    return(
        <>
            <div className={styles.form}>
                <div onClick={() => setTask(null)} className="w-[105%] max-md:w-[90%] h-fit items-start">
                <CloseTaskBtn/>
                </div>
                <div className="w-[474px] max-md:w-[370px] h-[606px] flex flex-col space-y-[10px] items-center">
                    <inputContext.Provider value={inputContextValue}>
                    <TaskInput placeholder={task.name}/>
                    </inputContext.Provider>
                    <hr className="border-0.5 border-bgLight w-[450px] max-md:w-[370px]"/>
                    <div className="flex flex-row space-x-[70px] w-[450px] max-md:w-[370px] items-center">
                        <p className="text-white font-semibold">Data de conclusão: </p>
                        <DatePicker selected={date} onChange={(e) => handleDate(e)}
                            customInput={<CustomDateButton path={"/dateicon.svg"}/>} />
                    </div>
                    <div className="flex flex-row justify-between w-[450px] max-md:w-[370px] items-center">
                        <p className="text-white font-semibold">Prioridade:</p>
                        <inputContext.Provider value={inputContextValue}>
                        <PriorityDropdown CurrPriority={task.priority} />
                        </inputContext.Provider>
                    </div>
                    <hr className="border-0.5 border-bgLight w-[450px] max-md:w-[370px]"/>
                    <p className="text-white font-semibold">Descrição:</p>
                    <inputContext.Provider value={inputContextValue}>
                    <TextBox text={task.description} />
                    </inputContext.Provider>
                    <hr className="border-0.5 border-bgLight w-[450px] max-md:w-[370px]"/>
                    <button className="flex space-x-[8px] items-center justify-center bg-lowPrio 
                    w-[150px] h-[36px] rounded-[4px] duration-300 ease-out hover:brightness-75"
                    onClick={assembleInfo}>
                        <img src="/confirmicon.svg"></img>
                        <p className="text-lowPrioText">Editar Task</p>
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {denial && (
                <modalContext.Provider value={modalDenContextValue}>
                <motion.div className="absolute top-[20px] left-1/2 -translate-x-1/2" initial={{y: '-100%'}} animate={{y: '0'}} exit={{y: '-100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
                    <DenialModal text={modalText} />
                </motion.div>
                </modalContext.Provider>
                )}
            </AnimatePresence>
        </>
    );
}

export default EditTask