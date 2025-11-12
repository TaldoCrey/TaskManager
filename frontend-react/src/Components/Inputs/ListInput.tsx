import React, { useState } from "react";
import styles from "./Inputs.module.css"

type props = {
    sendBack: (data: string) => void;
}

function ListInput({sendBack}: props) {

    const [value, setValue] = useState('');

    const handleValue = () => {
        sendBack(value);
    }

    return(
        <input className="w-[445px] h-[45px] rounded-[12px] p-[8px] border-1 border-[#4e4e4e] outline-none
        text-white text-[16px] duration-300 ease-out focus:border-white hover:border-white" 
        placeholder="Qual o nome da sua lista de afazeres?" onChange={(e) => setValue(e.target.value)}
        onBlur={handleValue}/>
    );
}

export default ListInput