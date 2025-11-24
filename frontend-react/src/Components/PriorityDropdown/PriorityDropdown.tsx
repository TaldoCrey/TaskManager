import React, { useEffect, useState, useRef, useContext, use } from "react";
import styles from "./PriorityDropdown.module.css"
import { inputContext } from "../contexts";

type dropProperties = {
    visible: boolean,
    x: number,
    y: number
}

type props = {
    CurrPriority: string,
}

function PriorityDropdown({CurrPriority = "LOW"}: props) {

    const [priority, setPriority] = useState(CurrPriority);
    const [priorityText, setPText] = useState("");
    const [priorityTagStyle, setPTStyle] = useState(styles.lowprioritytag);
    const [dropdown, setDropdown] = useState<dropProperties>({visible: false, x:0, y:0});
    const [dropStyle, setDropStyle] = useState(styles.dropdown);

    const dropRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const iContext = useContext(inputContext);
    const {handleInfo} = iContext;

    const handleContextDropdown = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!triggerRef.current) {
            return
        }
        const rect = triggerRef.current.getBoundingClientRect();
        setDropdown({visible: true, x:rect.left, y:rect.bottom + 5});
    }

    const handleCloseDropdown = () => {
        setDropdown(m => m = {...m, visible: false});
    }

    const handleOptionClick = (option: string) => {
        setPriority(option);
        handleInfo(option, "PriorityDropdown");
        handleCloseDropdown();
    }

    useEffect(() => {
        switch (priority) {
            case "LOW":
                setPTStyle(styles.lowprioritytag);
                setPText("Baixa Prioridade");
                break;
            case "MEDIUM":
                setPTStyle(styles.midprioritytag);
                setPText("Média Prioridade");
                break;
            case "HIGH":
                setPTStyle(styles.highprioritytag);
                setPText("Alta Prioridade");
                break;
            case "VERY_HIGH":
                setPTStyle(styles.veryhighprioritytag);
                setPText("Altíssima Prioridade");
                break;
        }

    }, [priority])

    useEffect(() => {
        if (!dropdown.visible) {
            return;
        }

        setDropStyle(styles.dropdownlock);

        const handleClickOutside = (e: MouseEvent) => {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
                handleCloseDropdown();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            setDropStyle(styles.dropdown);
        }

    }, [dropdown.visible])

    return(
        <div>
            <div ref={triggerRef} className={dropStyle} onClick={handleContextDropdown}>
                <div className={priorityTagStyle}>{priorityText}</div>
                <img src="/dropicon.svg"></img>
            </div>

            {dropdown.visible && (
                <div ref={dropRef} style={{position: 'fixed', top:`${dropdown.y}px`, left: `${dropdown.x}px`, zIndex:1000}}
                className="border-1 border-gray rounded-[4px] max-sm:w-[170px]">
                    <ul>
                        <div className={styles.dropitem} onClick={() => {handleOptionClick('LOW');}}>
                        <li className={styles.lowprioritytag}>Baixa Prioridade</li>
                        </div>
                        <div className={styles.dropitem} onClick={() => {handleOptionClick('MEDIUM');}}>
                        <li className={styles.midprioritytag}>Média Prioridade</li>
                        </div>
                        <div className={styles.dropitem} onClick={() => {handleOptionClick('HIGH');}}>
                        <li className={styles.highprioritytag}>Alta Prioridade</li>
                        </div>
                        <div className={styles.dropitem} onClick={() => {handleOptionClick('VERY_HIGH');}}>
                        <li className={styles.veryhighprioritytag}>Altíssima Prioridade</li>
                        </div>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default PriorityDropdown