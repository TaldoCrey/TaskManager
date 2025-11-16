import { useContext, useEffect, useRef, useState } from "react";
import styles from "./TextBox.module.css"
import { inputContext } from "../contexts";

type props = {
    text: string,
}

function TextBox({text = ""}:props) {
    const [textv, setText] = useState(text)

    const iContext = useContext(inputContext);

    const {handleInfo} = iContext;

    return(
        <textarea className="w-[472px] max-md:w-[370px] h-[232px] outline-none border-1 p-[8px] rounded-[4px] border-[#4e4e4e] resize-none
        text-white text-[16px] duration-300 ease-in focus:border-white hover:border-white" 
        onChange={(e) => setText(e.target.value)} value={textv} onBlur={() => handleInfo(textv, "TextBox")}/>
    );
}

export default TextBox