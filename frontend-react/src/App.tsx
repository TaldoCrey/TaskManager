import TaskCard from "./Components/TaskCard/TaskCard.tsx"
import Navbar from "./Components/Navbar/Navbar.tsx"
import OptionButton from "./Components/OptionsButton/OptionsButton.tsx"
import NewThingBtn from "./Components/NewThingBtn/NewThingBtn.tsx"
import CloseTaskBtn from "./Components/CloseTaskBtn/CloseTaskBtn.tsx"
import PriorityDropdown from "./Components/PriorityDropdown/PriorityDropdown.tsx"
import ListTitle from "./Components/ListTitle/ListTitle.tsx"
import TextBox from "./Components/TextBox/TextBox.tsx"
import ListInput from "./Components/Inputs/ListInput.tsx"
import TaskInput from "./Components/Inputs/TaskInput.tsx"
import NewTask from "./Components/Forms/NewTask.tsx"
import EditTask from "./Components/Forms/EditTask.tsx"
import NewList from "./Components/Forms/NewList.tsx"
import React, { useEffect, useRef, useState } from "react"
import type { Task, TaskList } from "./Components/types.ts"
import styles from "./App.module.css"
import {motion, AnimatePresence} from 'framer-motion'

type CardOptionInfo = {
  listIndex: number,
  taskIndex: number,
  option: string
}

function App() {

  const [lists, setLists] = useState<TaskList[]>([]);
  const [cardOptionInfo, setCardOptionInfo] = useState<CardOptionInfo>();
  const [isEdit, setIsEdit] = useState(false);
  const [isNList, setNList] = useState(false);
  const [isNTask, setNtask] = useState(false);
  const [targetTask, setTargetTask] = useState<Task>({name:"", description:"", date:new Date(), id: -1, priority:"", finished:false});

  const IDRef = useRef(3);
  const newTaskListID = useRef(0);


  const handleCardOptionClick = (listIndex:number, taskIndex:number, option: string) => {
    setCardOptionInfo({listIndex, taskIndex, option});
  }

  const handleEditForm = (t: Task | null, n: number) => {
    setIsEdit(false);

    console.log("edit")

    if (n === 0 && t && cardOptionInfo) {
      setTargetTask(t);
      IDRef.current++;
      t.id = IDRef.current;
      let targetList = lists[cardOptionInfo.listIndex]
      targetList.tasklist[cardOptionInfo.taskIndex] = t
    
      let finalList = [...lists];
      finalList[cardOptionInfo.listIndex] = targetList; 
      setLists(l => l = finalList);
    }
  }

  const handleNewList = (data: TaskList | null, ecall: number) => {
    setNList(false);

    console.log("nlist");

    if (ecall === 0 && data) {
      setLists(l => l = [...l, data])
    }
  }

  const handleNewTask = (data: Task | null, ecall: number) => {
    setNtask(false);

    if (ecall === 0 && data) {
      IDRef.current++;
      data.id = IDRef.current;

      let finalList = [...lists];
      finalList[newTaskListID.current].tasklist.push(data);
      setLists(l => l = finalList);
    }
  }

  useEffect(() => {
    console.log(cardOptionInfo)
    if (!cardOptionInfo) return
    let targetList = lists[cardOptionInfo.listIndex]
    let trgtTask = targetList.tasklist[cardOptionInfo.taskIndex]

    setTargetTask({...trgtTask});

    if (cardOptionInfo.option === "Duplicar") {
      IDRef.current++;
      trgtTask.id = IDRef.current;
      targetList.tasklist.push(trgtTask)
    
      setLists(l => l = [...l.map((tl, id) => {
        if (id === cardOptionInfo.listIndex) {
          return targetList;
        } else {
          return tl;
        }
      })])
    } else if (cardOptionInfo.option === "Deletar") {
      targetList.tasklist = targetList.tasklist.filter((_, i) => i !== cardOptionInfo.taskIndex)
      let finalList = [...lists];
      finalList[cardOptionInfo.listIndex] = targetList; 
      setLists(l => l = finalList);
    } else if (cardOptionInfo.option === "Editar") {
      setIsEdit(true);
    }

  }, [cardOptionInfo])

  return (
    <div className="min-h-screen bg-bg font-family-poppins">
      <div>
        <Navbar />
      </div>
      <div className={styles.appbody}>
        <ul className={styles.tasklist}>
          {lists.map((list: TaskList, index: number) => {
             console.log(lists)
            return <li key={index}>
              <div className={styles.list}>
                <ListTitle title={list.title}/>
                <ul className={styles.tasks}>
                  {list.tasklist.map((task: Task, taskIndex: number) => {
                    return <li key={task.id}>
                      <TaskCard taskinfo={task} menuChoice={(dataDoForm) => handleCardOptionClick(index, taskIndex, dataDoForm)}/>
                    </li>
                  })}
                  <li onClick={() => {newTaskListID.current = index; setNtask(true)}}>
                    <NewThingBtn label="Nova Tarefa"/>
                  </li>
                </ul>
              </div>
            </li>
          })}
          <li onClick={() => setNList(true)}>
            <NewThingBtn label="Nova Lista"/>
          </li>
        </ul>
      </div>
      <AnimatePresence>
      {isEdit && (
        <motion.div className="absolute top-0 right-0" initial={{x: '100%'}} animate={{x: '0'}} exit={{x: '100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
          <EditTask taskinfo={targetTask} formhandler={handleEditForm}/>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {isNList && (
        <motion.div className="absolute top-0 right-0" initial={{x: '100%'}} animate={{x: '0'}} exit={{x: '100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
          <NewList formhandler={handleNewList}/>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {isNTask && (
        <motion.div className="absolute top-0 right-0" initial={{x: '100%'}} animate={{x: '0'}} exit={{x: '100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
          <NewTask formhandler={handleNewTask}/>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}

/*

*/

export default App
