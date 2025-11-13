import Navbar from "./Components/Navbar/Navbar.tsx"
import NewThingBtn from "./Components/NewThingBtn/NewThingBtn.tsx"
import NewTask from "./Components/Forms/NewTask.tsx"
import EditTask from "./Components/Forms/EditTask.tsx"
import NewList from "./Components/Forms/NewList.tsx"
import React, { useEffect, useRef, useState } from "react"
import type { Task, TaskList } from "./Components/types.ts"
import styles from "./App.module.css"
import {motion, AnimatePresence} from 'framer-motion'
import { DndContext, useDroppable, type DragEndEvent } from "@dnd-kit/core"
import TaskListComponent from "./Components/TaskList/TaskList.tsx"
import axios from 'axios'

type CardOptionInfo = {
  listIndex: number,
  taskIndex: number,
  option: string
}

function App() {

  const [lists, setLists] = useState<TaskList[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isLEdit, setIsLEdit] = useState(false);
  const [isNList, setNList] = useState(false);
  const [isNTask, setNtask] = useState(false);
  const [targetTask, setTargetTask] = useState<Task>({name:"", description:"", date:new Date(), id: -1, priority:"", finished:false});
  const [targetList, setTargetList] = useState<TaskList>({title:"", id:-1, tasklist: []});

  const IDRef = useRef(0);

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;

    if (!over) return;
    
    const taskId = active.id as number;
    const newListID = over.id as number;

    let FinalList = [...lists]
    console.log([...FinalList])
    console.log(taskId, newListID)

    let currListIndex: number | null = null;
    let dragTaskIndex: number | null = null;
    FinalList.forEach((tl, index) => {
      tl.tasklist.forEach((t, tindex) => {
        if (t.id == taskId) {
          currListIndex = index;
          dragTaskIndex = tindex;
        }
      })
    });
    
    console.log(currListIndex)

    if (currListIndex != null && dragTaskIndex != null) {
      if (over.id == FinalList[currListIndex].id) return;
      const dragTask = FinalList[currListIndex].tasklist[dragTaskIndex];
      console.log("cheguemo", dragTask)
      FinalList[newListID].tasklist.push({...dragTask})
      console.log({...FinalList[newListID]})
      FinalList[currListIndex].tasklist = [...FinalList[currListIndex].tasklist.filter((t) => t.id !==dragTask.id)];
      console.log({...FinalList[currListIndex]})
      console.log([...FinalList]);
      setLists([...FinalList]);
    }
  }

  return ( 
    <div className="min-h-screen bg-bg font-family-poppins">
      <div>
        <Navbar />
      </div>
      <div className={styles.appbody}>
        <ul className={styles.tasklist}>
          <DndContext onDragEnd={handleDragEnd}>
            {lists.map((List: TaskList, Index: number) => {
              return <li key={List.id}>
                <TaskListComponent list={List} index={Index} />
                </li>
            })}
          </DndContext>
          <li className="h-fit" onClick={() => setNList(true)}>
            <NewThingBtn label="Nova Lista"/>
          </li>
        </ul>
      </div>
      <AnimatePresence>
      {isEdit && (
        <motion.div className="absolute top-0 right-0" initial={{x: '100%'}} animate={{x: '0'}} exit={{x: '100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
          <EditTask taskinfo={targetTask} />
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {isNList && (
        <motion.div className="absolute top-0 right-0" initial={{x: '100%'}} animate={{x: '0'}} exit={{x: '100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
          <NewList placeholder="" />
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {isNTask && (
        <motion.div className="absolute top-0 right-0" initial={{x: '100%'}} animate={{x: '0'}} exit={{x: '100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
          <NewTask />
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {isLEdit && (
        <motion.div className="absolute top-0 right-0" initial={{x: '100%'}} animate={{x: '0'}} exit={{x: '100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
          <NewList placeholder={targetList.title} />
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}

/*

*/

export default App
