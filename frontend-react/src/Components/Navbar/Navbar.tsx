import styles from "./Navbar.module.css"

function Navbar() {

    return(
        <div className="bg-linear-to-r from-bgLight to-bg w-fill max-md:w-[430px] max-sm:w-[330px] h-[84px] border-b-1 border-[#4e4e4e]
        flex flex-row justify-between px-[80px] max-md:px-[40px] max-sm:px-[20px] py-[12px] items-center">
            <div>
                <h1 className="font-extrabold text-white shadow-2xl/30 text-[18px]">TaskManager</h1>
            </div>
            <div className="w-[178px] max-md:w-[100px] h-[36px] space-x-[12px] flex items-center">
                <div className="w-[32px] h-[32px] rounded-[4px] duration-200 ease-out hover:bg-bgLight active:bg-[#343333] flex items-center justify-center">
                    <img src="/notificon.svg" className="w-[23px] h-[23px] duration-200 ease-out hover:bg-bgLight active:bg-[#343333]"></img>
                </div>
                <div className="w-[128px] max-md:w-[36px] h-[36px] flex justify-center items-center space-x-[8px] rounded-[12px]
                max-md:rounded-[8px] max-md:justify-items-center duration-200 ease-out hover:bg-bgLight">
                    <img src="accicon.svg" className="w-[23px] h-[23px] max-md:ml-[10px]"></img>
                    <h2 className="font-bold text-white max-md:hidden max-md:w-0">User</h2>
                </div>
            </div>

        </div>
    );

}

export default Navbar