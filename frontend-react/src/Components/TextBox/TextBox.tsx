import { useEffect, useRef, useState } from "react";
import styles from "./TextBox.module.css"

type props = {
    text: string,
    sendBack: (data:string) => void;
}

function TextBox({text = "", sendBack}:props) {
    const [textv, setText] = useState(text)

    return(
        <textarea className="w-[472px] h-[232px] outline-none border-1 p-[8px] rounded-[4px] border-[#4e4e4e] resize-none
        text-white text-[16px] duration-300 ease-in focus:border-white hover:border-white" 
        onChange={(e) => setText(e.target.value)} onBlur={() => sendBack(textv)} value={textv}/>
    );
}

export default TextBox