import styles from "./Form.module.css"
import type { TaskList } from "../types.ts"
import ListInput from "../Inputs/ListInput";
import CloseTaskBtn from "../CloseTaskBtn/CloseTaskBtn.tsx";
import { useContext, useEffect, useState } from "react";
import { createListContext, inputContext, modalContext, updateListContext, type InputContext, type ModalContext } from "../contexts.ts";
import { AnimatePresence, motion } from "framer-motion";
import DenialModal from "../Modals/DenialModal.tsx";

type props = {
    placeholder: string
    isEdit: boolean
}

function NewList({placeholder = "Qual o nome da sua lista de afazeres?", isEdit} : props) {

    const cListContext = useContext(createListContext);
    const eListContext = useContext(updateListContext);
    const [denial, setDenialModal] = useState(false);
    const [modalText, setModalText] = useState("");


    const [listTitle, setTitle] = useState("");

    const {sendList} = cListContext;
    const {list, setList} = eListContext;

    const inputContextValue: InputContext = {
        handleInfo: (info:string, type:string) => {
            setTitle(info);
        } 
    }

    const modalDenContextValue: ModalContext = {
        setState: setDenialModal
    }

    const nullReturn = () => {
        if (isEdit) {
            setList(null)
        } else {
            sendList(null)
        }
    }

    useEffect(() => {
        let timerId = setTimeout(() => {
            setDenialModal(false);
        }, 3000)

        return () => {
            clearTimeout(timerId);
        }
    }, [denial])

    const assembleInfo = () => {
        if (listTitle.trim() == "") {
            setModalText("O Nome da lista é obrigatório!");
            setDenialModal(true);
            return;
            return;
        }

        if (isEdit) {
            let editList: TaskList = {title: listTitle, id: list.id, tasklist: [...list.tasklist]}
            setList(editList);
        } else {
            let newList: TaskList = {title: listTitle, id:"", tasklist: []}
            sendList(newList)
        }
    }

    return(
        <>
        <div className={styles.form}>
            <div onClick={nullReturn} className="w-[105%] max-md:w-[90%] max-sm:w-[85%] h-fit items-start">
                <CloseTaskBtn/>
            </div>
            <div className="w-[474px] max-md:w-[200px] h-[606px] flex flex-col space-y-[10px] items-center">
                <inputContext.Provider value={inputContextValue}>
                <ListInput placeholder={placeholder}/>
                </inputContext.Provider>
                <hr className="bg-white"/>
                <hr className="border-0.5 border-bgLight w-[450px] max-md:w-[250px]"/>
                <button className="flex space-x-[8px] items-center justify-center bg-lowPrio 
                w-[150px] h-[36px] rounded-[4px] duration-300 ease-out hover:brightness-75"
                onClick={assembleInfo}>
                    <img src="/confirmicon.svg"></img>
                    <p className="text-lowPrioText">Criar Lista</p>
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

export default NewList