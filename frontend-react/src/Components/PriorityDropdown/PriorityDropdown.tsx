import React, { useEffect, useState, useRef } from "react";
import styles from "./PriorityDropdown.module.css"

type dropProperties = {
    visible: boolean,
    x: number,
    y: number
}

type props = {
    CurrPriority: string,
}

function PriorityDropdown({CurrPriority = "Baixa Prioridade"}: props) {

    const [priority, setPriority] = useState(CurrPriority);
    const [priorityTagStyle, setPTStyle] = useState(styles.lowprioritytag);
    const [dropdown, setDropdown] = useState<dropProperties>({visible: false, x:0, y:0});
    const [dropStyle, setDropStyle] = useState(styles.dropdown);

    const dropRef = useRef<HTMLDivElement>(null);

    const handleContextDropdown = (e: React.MouseEvent) => {
        e.preventDefault();
        setDropdown({visible: true, x:e.clientX, y:e.clientY});
    }

    const handleCloseDropdown = () => {
        setDropdown(m => m = {...m, visible: false});
    }

    const handleOptionClick = (option: string) => {
        setPriority(option);
        handleCloseDropdown();
    }

    useEffect(() => {
        switch (priority) {
            case "Baixa Prioridade":
                setPTStyle(styles.lowprioritytag);
                break;
            case "Média Prioridade":
                setPTStyle(styles.midprioritytag);
                break;
            case "Alta Prioridade":
                setPTStyle(styles.highprioritytag);
                break;
            case "Altíssima Prioridade":
                setPTStyle(styles.veryhighprioritytag);
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
            <div className={dropStyle} onClick={handleContextDropdown}>
                <div className={priorityTagStyle}>{priority}</div>
                <img src="/dropicon.svg"></img>
            </div>

            {dropdown.visible && (
                <div ref={dropRef} style={{position: 'fixed', top:`${dropdown.y}px`, left: `${dropdown.x}px`, zIndex:1000}}
                className="border-1 border-gray rounded-[4px]">
                    <ul>
                        <div className={styles.dropitem} onClick={() => {handleOptionClick('Baixa Prioridade');}}>
                        <li className={styles.lowprioritytag}>Baixa Prioridade</li>
                        </div>
                        <div className={styles.dropitem} onClick={() => {handleOptionClick('Média Prioridade');}}>
                        <li className={styles.midprioritytag}>Média Prioridade</li>
                        </div>
                        <div className={styles.dropitem} onClick={() => {handleOptionClick('Alta Prioridade');}}>
                        <li className={styles.highprioritytag}>Alta Prioridade</li>
                        </div>
                        <div className={styles.dropitem} onClick={() => {handleOptionClick('Altíssima Prioridade');}}>
                        <li className={styles.veryhighprioritytag}>Altíssima Prioridade</li>
                        </div>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default PriorityDropdown