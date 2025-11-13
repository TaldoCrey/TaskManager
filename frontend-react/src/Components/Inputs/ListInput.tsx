import React, { useState } from "react";
import styles from "./Inputs.module.css"

type props = {
    placeholder: string
}

function ListInput({placeholder}: props) {

    const [value, setValue] = useState('');

    return(
        <input className="w-[445px] h-[45px] rounded-[12px] p-[8px] border-1 border-[#4e4e4e] outline-none
        text-white text-[16px] duration-300 ease-out focus:border-white hover:border-white" 
        placeholder={placeholder} onChange={(e) => setValue(e.target.value)}
        />
    );
}

export default ListInput