import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Inputs.module.css"
import { inputContext } from "../contexts";

type props = {
    placeholder: string,
}

function TaskInput({placeholder}: props) {
    const [text, setText] = useState('');

    const iContext = useContext(inputContext);

    const {handleInfo} = iContext;

    return(
        <input className="w-[445px] h-[65px] rounded-[12px] p-[8px] border-1 border-[#4e4e4e] outline-none
        text-white text-[20px] duration-300 ease-out focus:border-white hover:border-white
        font-bold" onChange={(e) => setText(e.target.value)}
        placeholder={placeholder} onBlur={() => handleInfo(text, "TaskInput")}/>
    );
}

export default TaskInput