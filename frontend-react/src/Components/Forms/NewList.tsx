import styles from "./Form.module.css"
import type { TaskList } from "../types.ts"
import ListInput from "../Inputs/ListInput";
import CloseTaskBtn from "../CloseTaskBtn/CloseTaskBtn.tsx";
import { useState } from "react";

type props = {
    formhandler: (newList: TaskList | null, exit_call:number) => void;
    placeholder: string
}

function NewList({formhandler, placeholder = "Qual o nome da sua lista de afazeres?"} : props) {

    const nameHandler = (data: string) => {
        
        let newList = {title: data, id:-1, tasklist: []} as TaskList

        formhandler(newList, 0);
    }

    return(
        <div className={styles.form}>
            <div onClick={() => formhandler(null, 1)}>
                <CloseTaskBtn/>
            </div>
            <div className="w-[474px] h-[606px] flex flex-col space-y-[10px] items-center">
                <ListInput placeholder={placeholder} sendBack={nameHandler}/>
                <hr className="bg-white"/>
                <hr className="border-0.5 border-bgLight w-[450px]"/>
                <button className="flex space-x-[8px] items-center justify-center bg-lowPrio 
                w-[150px] h-[36px] rounded-[4px] duration-300 ease-out hover:brightness-75">
                    <img src="/confirmicon.svg"></img>
                    <p className="text-lowPrioText">Criar Lista</p>
                </button>
                
            </div>
        </div>
    );
}

export default NewList