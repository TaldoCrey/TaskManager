import { useContext } from "react";
import { modalContext } from "../contexts";

type props = {
    text: string
}

function DenialModal({text}: props) {

    const Context = useContext(modalContext);
    const {setState} = Context;

    return(
        <div className="w-[400px] max-md:w-[360px] max-sm:w-[280px] h-[40px] bg-[#252628] rounded-[12px] border-[0.5px] border-white
        px-[16px] py-[8px] flex justify-center items-center space-x-[16px] z-[2000] shadow-2xl/30">
            <img src="/warningicon.svg" className="w-[20px] h-[20px]"></img>
            <p className="text-[#AF0505]">{text}</p>
            <button className="w-[16px] h-[16px]" onClick={() => setState(false)}>
                <img src="/redClose.svg" className="w-fill h-fill"></img>
            </button>
        </div>
    );
}

export default DenialModal;