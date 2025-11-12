import { useEffect, useRef, useState } from "react";
import styles from "./Inputs.module.css"

type props = {
    placeholder: string,
    sendBack: (data: string) => void;
}

function TaskInput({placeholder, sendBack}: props) {
    const [text, setText] = useState('');

    

    return(
        <input className="w-[445px] h-[65px] rounded-[12px] p-[8px] border-1 border-[#4e4e4e] outline-none
        text-white text-[20px] duration-300 ease-out focus:border-white hover:border-white
        font-bold" onChange={(e) => setText(e.target.value)} onBlur={() => sendBack(text)}
        placeholder={placeholder}/>
    );
}

export default TaskInput