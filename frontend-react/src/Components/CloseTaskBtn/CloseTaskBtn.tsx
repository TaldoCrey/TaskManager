import styles from "./CloseTaskBtn.module.css"

function CloseTaskBtn() {
    return(
        <button className="w-[32px] h-[32px] flex justify-center items-center">
            <img src="/closetaskicon.svg" className="w-[24px] h-[24px] p-[4px] rounded-[2px]
            duration-200 ease-out hover:bg-bgLight active:bg-[#343333]"/>
        </button>
    );
}

export default CloseTaskBtn