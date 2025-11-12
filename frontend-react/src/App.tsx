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
import { DndContext, useDroppable, type DragEndEvent } from "@dnd-kit/core"
import TaskListC from "./Components/TaskList/TaskList.tsx"

type CardOptionInfo = {
  listIndex: number,
  taskIndex: number,
  option: string
}

function App() {

  const [lists, setLists] = useState<TaskList[]>([]);
  const [cardOptionInfo, setCardOptionInfo] = useState<CardOptionInfo>();
  const [isEdit, setIsEdit] = useState(false);
  const [isLEdit, setIsLEdit] = useState(false);
  const [isNList, setNList] = useState(false);
  const [isNTask, setNtask] = useState(false);
  const [targetTask, setTargetTask] = useState<Task>({name:"", description:"", date:new Date(), id: -1, priority:"", finished:false});
  const [targetList, setTargetList] = useState<TaskList>({title:"", id:-1, tasklist: []});
  const [TListId, setTLId] = useState(0);


  const IDRef = useRef(3);
  const LIDRef = useRef(1);
  const newTaskListID = useRef(0);

  useEffect(() => {
    setLists([
      {
        title: "A",
        id: 0,
        tasklist: [
          {name:"A", description:"B", date: new Date(), priority:"Baixa Prioridade", id: 0, finished: false},
          {name:"B", description:"C", date: new Date(), priority:"Baixa Prioridade", id: 1, finished: false}
        ]
      },
      {
        title: "B",
        id: 1,
        tasklist: [
          {name:"C", description:"D", date: new Date(), priority:"Baixa Prioridade", id: 2, finished: false},
          {name:"E", description:"F", date: new Date(), priority:"Baixa Prioridade", id: 3, finished: false}
        ]
      }
    ])
  }, [])


  const handleCardOptionClick = (listIndex:number, taskIndex:number, option: string) => {
    if (option === "") return;
    console.log("app," ,listIndex, taskIndex, option);
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
      LIDRef.current++;
      data.id = LIDRef.current;
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

  const handleListMenu = (index:number, data:string) => {
    setTargetList(lists[index]);
    setTLId(index);

    if (data === "Deletar") {
      setLists(l => l = l.filter((_, id) => id !== index));
    } else if (data === "Renomear") {
      setIsLEdit(true);
    }
  }

  const handleEditList = (tl: TaskList | null, ecall: number) => {
    setIsLEdit(false);

    console.log("ledit")

    if (ecall === 0 && tl) {
      //LIDRef.current++;
      //tl.id = LIDRef.current;
    
      let finalList = [...lists];
      finalList[TListId] = tl; 
      setLists(l => l = finalList);
    }
  }

  const finishTask = (lid:number, tid:number, state:boolean) => {
    if (state === false) return;
    console.log("Finished task")
    let t = lists[lid].tasklist[tid];

    //IDRef.current++;
    //t.id = IDRef.current;
    t.finished = true;
    let targetList = {...lists[lid]}
    targetList.tasklist[tid] = {...t}
  
    let finalList = [...lists];
    finalList[lid] = targetList; 
    setLists(l => l = finalList);
}

  useEffect(() => {
    
    if (!cardOptionInfo) return
    let targetList = lists[cardOptionInfo.listIndex]
    console.log(targetList)
    let trgtTask = {...targetList.tasklist[cardOptionInfo.taskIndex]}
    setTargetTask({...trgtTask});

    console.log(targetTask)

    if (cardOptionInfo.option === "Duplicar") {
      console.log("Dup:", trgtTask)
      IDRef.current++;
      trgtTask.id = IDRef.current;
      console.log("Dup:", trgtTask)
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
                <TaskListC list={List} index={Index} listSendBack={(data) => handleListMenu(data.i, data.data)} 
                taskSendBack={(data, data2) => {handleCardOptionClick(data.i, data.ti, data.data); finishTask(data2.i_f, data2.ti_f, data2.data_f)}}
                nTaskSendBack={(data) => {newTaskListID.current = data.ntlid; setNtask(data.snt)}} />
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
          <EditTask taskinfo={targetTask} formhandler={handleEditForm}/>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {isNList && (
        <motion.div className="absolute top-0 right-0" initial={{x: '100%'}} animate={{x: '0'}} exit={{x: '100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
          <NewList placeholder="" formhandler={handleNewList}/>
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

      <AnimatePresence>
      {isLEdit && (
        <motion.div className="absolute top-0 right-0" initial={{x: '100%'}} animate={{x: '0'}} exit={{x: '100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
          <NewList placeholder={targetList.title} formhandler={handleEditList}/>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}

/*

*/

export default App
