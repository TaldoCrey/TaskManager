import { useContext } from "react";
import { modalContext } from "../contexts";

type props = {
    text: string
}

function ConfirmModal({text}: props) {

    const Context = useContext(modalContext);
    const {setState} = Context;

    return (
        <div className="w-fit h-fit max-w-[450px] max-md:w-[370px] max-sm:w-[280px] max-h-[220px] rounded-[12px] border-1 border-white
        px-[16px] py-[12px] bg-[#252628] space-y-[5px] shadow-2xl/30">
            <div className="w-fit h-[24px] flex justify-items-end items-center" onClick={() => setState(false)}>
                <img src="/closeicon.svg" className="w-[24px] h-[24px]"></img>
            </div>
            <p className="font-semibold text-white text-[20px] overflow-clip">{text}</p>
            <p className="text-white">Esta ação não é reversível</p>
            <button className="flex justify-center items-center p-[8px] w-fit h-fit space-x-[8px] ml-3
            duration-200 ease-in-out hover:bg-bgLight rounded-[10px]"
            onClick={() => setState(true)}>
                <img src="/delicon.svg"></img>
                <p className="text-[#AF0505]">Deletar</p>
            </button>
        </div>
    );
}

export default ConfirmModal