import React, { useContext, useState } from "react";
import styles from "./Inputs.module.css"
import { inputContext } from "../contexts";

type props = {
    placeholder: string
}

function ListInput({placeholder}: props) {

    const iContext = useContext(inputContext);

    const {handleInfo} = iContext;

    const [value, setValue] = useState('');

    return(
        <input className="w-[445px] max-md:w-[370px] h-[45px] rounded-[12px] p-[8px] border-1 border-[#4e4e4e] outline-none
        text-white text-[16px] duration-300 ease-out focus:border-white hover:border-white" 
        placeholder={placeholder} onChange={(e) => setValue(e.target.value)} onBlur={() => handleInfo(value, "text")}
        />
    );
}

export default ListInput