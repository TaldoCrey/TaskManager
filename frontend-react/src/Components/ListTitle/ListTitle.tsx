import styles from "./ListTitle.module.css"
import OptionButton from "../OptionsButton/OptionsButton";
import React, { useContext, useEffect, useRef, useState } from "react";
import { taskListContext } from "../contexts";

type menuProperties = {
    visible: boolean,
    x: number,
    y: number
}

type props = {
    title: string
    listId: string
}

function ListTitle({title, listId}: props) {

    const [menu, setMenu]= useState<menuProperties>({visible: false, x:0, y:0});

    const menuRef = useRef<HTMLDivElement>(null);

    const taskContext = useContext(taskListContext);
    const {setState} = taskContext;

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setMenu({visible: true, x:e.clientX - 100, y:e.clientY});
    }

    const handleCloseMenu = () => {
        setMenu(m => m = {...m, visible: false});
    }


    useEffect(() => {
        if (!menu.visible) {
            return;
        }

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                handleCloseMenu();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }

    }, [menu.visible])

    return(
        <div>
            <div className="w-[445px] max-md:w-[350px] h-[48px] flex justify-between items-center py-[8px]"
             onContextMenu={handleContextMenu}>
                <h2 className="text-white font-semibold text-[19px]">{title}</h2>
                <div onClick={handleContextMenu}>
                    <OptionButton />
                </div>
            </div>

            {menu.visible && (
                <div ref={menuRef} style={{position: 'fixed', top:`${menu.y}px`, left: `${menu.x}px`, zIndex:1000}} className={styles.menu}>
                    <ul className="py-[8px] px-[1px]">
                        <li
                        className="w-fill h-[40px] text-white text-[16px] flex items-center
                        duration-300 ease-out hover:bg-bgLight" onClick={() => setState("EDIT_LIST", listId)}>
                            <img src="/editicon.svg" className="w-[16px] h-[16px] mr-[5px] ml-[10px]"></img>
                            Renomear
                        </li>
                        <li
                        className="w-fill h-[40px] text-[#AF0505] text-[16px] flex items-center
                        duration-300 ease-out hover:bg-bgLight" onClick={() => setState("DEL_LIST", {listId, listName: title})}>
                            <img src="/delicon.svg" className="w-[16px] h-[16px] mr-[5px] ml-[10px]"></img>
                            Deletar
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ListTitle