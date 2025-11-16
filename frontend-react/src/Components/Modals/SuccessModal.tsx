import { useContext } from "react";
import { modalContext } from "../contexts";

type props = {
    text: string
}

function SuccessModal({text}: props) {

    const Context = useContext(modalContext);
    const {setState} = Context;

    return(
        <div className="w-fit max-md:w-[360px] h-[40px] bg-[#252628] rounded-[12px] border-[0.5px] border-white
        px-[16px] py-[8px] flex justify-center items-center space-x-[16px] z-[2000]">
            <img src="/successicon.svg" className="w-[20px] h-[20px]"></img>
            <p className="text-[#029007]">{text}</p>
            <button className="w-[16px] h-[16px]" onClick={() => setState(false)}>
                <img src="/greenClose.svg" className="w-fill h-fill"></img>
            </button>
        </div>
    );
}

export default SuccessModal;