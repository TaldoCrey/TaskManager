import styles from "./NewThingBtn.module.css"

type properties = {
    label: string
}

function NewThingBtn({label}: properties) {

    return(
        <button className="w-[152px] h-[44px] rounded-[4px] p-[10px] space-x-[10px] flex flex-row items-center
        justify-center duration-200 ease-out hover:bg-bgLight active:bg-[#343333]">
            <img src="/newtaskicon.svg"/>
            <p className="text-white font-semibold w-[96px] h-[24px] text-[15px]">{label}</p>
        </button>
    );

}

export default NewThingBtn