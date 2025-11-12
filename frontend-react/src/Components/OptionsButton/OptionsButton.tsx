import styles from "./OptionsButton.module.css"

function OptionButton() {
    return(
        <button className="w-[32px] h-[32px] rounded-[2px] p-[4px] flex items-center justify-center active:bg-[#343333]
        duration-300 ease-out hover:bg-bgLight">
            <img src="/options.svg"></img>
        </button>
    );
}

export default OptionButton