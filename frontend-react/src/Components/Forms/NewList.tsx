import styles from "./Form.module.css"
import type { TaskList } from "../types.ts"
import ListInput from "../Inputs/ListInput";
import CloseTaskBtn from "../CloseTaskBtn/CloseTaskBtn.tsx";
import { useContext, useState } from "react";
import { createListContext, inputContext, updateListContext, type InputContext } from "../contexts.ts";

type props = {
    placeholder: string
    isEdit: boolean
}

function NewList({placeholder = "Qual o nome da sua lista de afazeres?", isEdit} : props) {

    const cListContext = useContext(createListContext);
    const eListContext = useContext(updateListContext);

    const [listTitle, setTitle] = useState("");

    const {sendList} = cListContext;
    const {list, setList} = eListContext;

    const inputContextValue: InputContext = {
        handleInfo: (info:string, type:string) => {
            setTitle(info);
        } 
    }

    const nullReturn = () => {
        if (isEdit) {
            setList(null)
        } else {
            sendList(null)
        }
    }

    const assembleInfo = () => {
        if (isEdit) {
            let editList: TaskList = {title: listTitle, id: list.id, tasklist: [...list.tasklist]}
            setList(editList);
        } else {
            let newList: TaskList = {title: listTitle, id:"", tasklist: []}
            sendList(newList)
        }
    }

    return(
        <div className={styles.form}>
            <div onClick={nullReturn} className="w-fit h-fit">
                <CloseTaskBtn/>
            </div>
            <div className="w-[474px] h-[606px] flex flex-col space-y-[10px] items-center">
                <inputContext.Provider value={inputContextValue}>
                <ListInput placeholder={placeholder}/>
                </inputContext.Provider>
                <hr className="bg-white"/>
                <hr className="border-0.5 border-bgLight w-[450px]"/>
                <button className="flex space-x-[8px] items-center justify-center bg-lowPrio 
                w-[150px] h-[36px] rounded-[4px] duration-300 ease-out hover:brightness-75"
                onClick={assembleInfo}>
                    <img src="/confirmicon.svg"></img>
                    <p className="text-lowPrioText">Criar Lista</p>
                </button>
            </div>
        </div>
    );
}

export default NewList