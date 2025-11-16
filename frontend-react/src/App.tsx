import Navbar from "./Components/Navbar/Navbar.tsx"
import NewThingBtn from "./Components/NewThingBtn/NewThingBtn.tsx"
import NewTask from "./Components/Forms/NewTask.tsx"
import EditTask from "./Components/Forms/EditTask.tsx"
import NewList from "./Components/Forms/NewList.tsx"
import React, { useEffect, useRef, useState, useContext, createContext } from "react"
import type { Task, TaskList } from "./Components/types.ts"
import styles from "./App.module.css"
import {motion, AnimatePresence} from 'framer-motion'
import { DndContext, useDroppable, type DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core"
import TaskListComponent from "./Components/TaskList/TaskList.tsx"
import * as taskAPI from "./api/tasks.ts"
import * as listAPI from "./api/lists.ts"
import { 
  type CreateTaskContext,
  type CreateListContext,
  type UpdateTaskContext,
  type UpdateListContext, 
  createTaskContext,
  createListContext,
  type TaskListContext,
  taskListContext,
  updateTaskContext,
  updateListContext,
  modalContext,
  type ModalContext,
} from "./Components/contexts.ts"
import { CgCode, CgOpenCollective } from "react-icons/cg"
import SuccessModal from "./Components/Modals/SuccessModal.tsx"
import ConfirmModal from "./Components/Modals/ConfirmModal.tsx"
import DenialModal from "./Components/Modals/DenialModal.tsx"
import TaskPanel from "./Components/TaskPanel/TaskPanel.tsx"



function App() {

  const [lists, setLists] = useState<TaskList[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isLEdit, setIsLEdit] = useState(false);
  const [isNList, setNList] = useState(false);
  const [isNTask, setNtask] = useState(false);
  const [targetTask, setTargetTask] = useState<Task>({name:"", description:"", date:new Date(), id: "", priority:"", finished:false});
  const [targetList, setTargetList] = useState<TaskList>({title:"", id:"", tasklist: []});
  const [isSuccesModal, setSuccessModal] = useState(false);
  const [isDenialModal, setDenialModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [isConfirmation, setConfirmation] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [answer, setAnswer] = useState(false);
  const [opData, setOpData] = useState<{operation:string, i:any}>({operation: "", i:""});
  const [isTPanel, setTPanel] = useState(false);

  const TaskListID = useRef("");
  const TaskID = useRef("");

  const createTaskContextValue: CreateTaskContext = {
    sendTask: async (t) => {
      setNtask(false);
      if (t != null) {
        const taskId = await taskAPI.createTask(t, TaskListID.current);
        if (taskId) {
          t.id = taskId.taskId;
        }
        setLists(l => l.map((list) => {
          if (list.id != TaskListID.current) {
            return list;
          }

          return {...list, tasklist:[...list.tasklist, t]}
        }));
      } else {
        setModalText("Erro ao criar Task!");
        setDenialModal(true);
      }
      
    }
  }

  const createListContextValue: CreateListContext = {
    sendList: async (list) => {
      setNList(false);
      if (list != null) {
        const response = await listAPI.createList(list);
        let listId;
        let code;
        if (response) { 
          listId = response.data.listId;
          code = response.status;
        }
        if (code == 201) {
          if (listId) {
            list.id = listId;
          }
          setLists(l => l = [...l, list]);
        } else {
          setModalText("Erro ao criar Lista!");
          setDenialModal(true);
        }
        
      }
    }
  }

  const taskListContextValue: TaskListContext = {
    setState: async (s: string, i: any) => {
      switch (s) {
        case "NEW_TASK":
          setNtask(true);
          TaskListID.current = i;
          break;
        case "EDIT_TASK":
          setIsEdit(true);
          setTargetTask(i.task);
          TaskListID.current = i.listIndex;
          TaskID.current = i.taskIndex;
          break;
        case "FINISHED":
          await taskAPI.updateTask(i.task, true, "");
          setLists(l => l.map((list) => {
            if (list.id != i.listIndex) {
              return list;
            }

            return {...list, tasklist:list.tasklist.map((t) => {
              if (t.id != i.taskIndex) {
                return t;
              }

              return i.task;
            })}
          }));
          break;
        case 'DUPE_TASK': {
          const dupeId = await taskAPI.createTask(i.task, i.listIndex);
          if (dupeId) {
            i.task.id = dupeId;
          }

          setLists(l => l.map((list) => {
            if (list.id != i.listIndex) {
              return list;
            }

            return {...list, tasklist:[...list.tasklist, i.task]}
          }));
          break;
        }
        case "DEL_TASK":
          setTPanel(false);
          setConfirmText(`Tem certeza que deseja deletar a tarefa: ${i.taskName}?`)
          setConfirmation(true);
          setOpData({operation: s, i});
          break;
        case "DEL_LIST":
          setConfirmText(`Tem certeza que deseja deletar a lista: ${i.listName}, e todas as suas tarefas?`)
          setConfirmation(true);
          setOpData({operation: s, i});
          break;
        case "EDIT_LIST":
          setIsLEdit(true);
          setTargetList(lists.filter((list) => list.id === i)[0])
          break;
        case "EXIT":
          setTPanel(false);
          break;
        case "OPEN_TP":
          setTPanel(true);
          setTargetTask(i.task);
          TaskListID.current = i.listIndex;
          break;
      }
    }
  }

  const updateTaskContextValue: UpdateTaskContext = {
    task: targetTask,
    setTask: async (t) => {
      setIsEdit(false);
      if (t != null) {
        const data = await taskAPI.updateTask(t, false, "");
        let code;
        if (data) {
          code = data.status;
        }
        if (code == 200) {
          setLists(l => l.map((list) => {
            if (list.id != TaskListID.current) {
              return list;
            }

            return {...list, tasklist:list.tasklist.map((task) => {
              if (task.id != TaskID.current) {
                return task;
              }

              return t;
            })}
          }));
          setModalText("Task editada com Sucesso!");
          setSuccessModal(true);
        } else {
          setModalText("Erro ao editar Task!");
          setDenialModal(true);
        }
      }
    }
  }

  const updateListContextValue: UpdateListContext = {
    list: targetList,
    setList: async (editList) => {
      setIsLEdit(false);
      if (editList != null) {
        const response = await listAPI.editList(editList);
        let code;
        if (response) { 
          code = response.status;
        }
        if (code == 200) {
          setLists(l => l.map((list) => {
            if (list.id === editList.id) {
              return editList;
            }
            return list;
          }))
          setModalText("Lista editada com Sucesso!");
          setSuccessModal(true);
        } else {
          setModalText("Erro ao editar Lista!");
          setDenialModal(true);
        }
      }
    }
  }

  const modalContextValue: ModalContext = {
    setState: setSuccessModal
  }

  const modalDenContextValue: ModalContext = {
    setState: setDenialModal
  }

  const confirmContextValue: ModalContext = {
    setState: (answ: boolean) => {
      setConfirmation(false);
      setAnswer(answ);
    }
  }

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 120,
      tolerance: 0
    }
  });

  const sensors = useSensors(pointerSensor);

  const handleDragEnd = async (event: DragEndEvent) => {
    const {active, over} = event;

    if (!over) return;
    
    const taskId = active.id as string;
    const newListID = over.id as number;

    let taskData = await taskAPI.getTaskById(taskId);

    const currTask:Task = {
      name: taskData.taskName,
      description: taskData.description,
      id: taskData.taskId,
      priority: taskData.priority,
      date: new Date(taskData.expectedFinishDate),
      finished: taskData.finishDate != null ? true : false
    }

    const currListID = taskData.listId;

    let newList = lists[newListID];

    let currList = lists.filter((list) => list.id === currListID)[0]

    console.log("-----")
    console.log(taskId)
    console.log(newListID)
    console.log(newList)
    console.log(currList)
    console.log(currTask)

    if (currTask != null && newList.id !== currList.id) {
      newList.tasklist = [...newList.tasklist, currTask];
      currList.tasklist = [...currList.tasklist.filter((t) => t.id != taskId)];

      await taskAPI.updateTask(currTask, false, newList.id);

      setLists(l => l.map((list) => {
        if (list.id == newList.id) {
          return newList
        } else if (list.id == currList.id) {
          return currList
        } else {
          return list
        }
      }))
    }  
  }

  const deleteList = async (i: any) => {
    const data = await listAPI.deleteListById(i.listId);
    let code;
    if (data) {
      code = data.status;
    }
    if (code != 200) {
        setModalText("Erro ao deletar Lista!");
        setDenialModal(true);
        return;
    }
    setLists(l => l.filter((list) => {
      if (list.id !== i.listId) {
        return list;
      }
    }));
    setModalText("Lista deletada com Sucesso!");
    setSuccessModal(true);
  }

  const deleteTask = async (i: any) => {
    const data = await taskAPI.deleteTaskById(i.taskId);
    let code;
    if (data) {
      code = data.status;
    }
    if (code != 200) {
        setModalText("Erro ao deletar Task!");
        setDenialModal(true);
        return;
    }

    setLists(l => l.map((list) => {
      if (list.id != i.listId) {
        return list;
      }

      return {...list, tasklist:list.tasklist.filter((t) => {
        if (t.id != i.taskId) {
          return t;
        }
      })}
    }));
    setModalText("Task deletada com Sucesso!");
    setSuccessModal(true);
  }

  useEffect(() => {
    const {operation, i} = opData;
    switch (operation) {
      case "DEL_TASK":
        console.log("DELTASK")
        if (answer) {
          deleteTask(i);
        }
        setAnswer(false);
        break;
      case "DEL_LIST":
        if (answer) {
          deleteList(i);
        }
        setAnswer(false);
        break;
    }
  }, [answer])

  useEffect(() => {
    let timerId: number;
    if (isSuccesModal) {
      timerId = setTimeout(() => {
        setSuccessModal(false);
      }, 3000)
    } else if (isDenialModal) {
      timerId = setTimeout(() => {
        setDenialModal(false);
      }, 3000)
    }

    return () => {
      clearTimeout(timerId);
    }
  }, [isSuccesModal, isDenialModal])

  const fetchlists = async () => {
    const data = await listAPI.getLists();
    if (data) {
      let initialLists: TaskList[] = [];
      data.forEach((e: any) => {
        initialLists.push({id: e.listID, title: e.listName, tasklist:[...e.taskList.map((t: any) =>
        ({name: t.taskName, description: t.description, id: t.taskId,
          priority: t.priority, date: new Date(t.expectedFinishDate), finished: t.finishDate !== null ? true : false
        }))]} as TaskList)
      })
      setLists(initialLists);
    }
  }

  useEffect(() => {
    fetchlists()
  }, [])

  return ( 
    <div className="min-h-[100vh] w-[100vw] bg-bg font-family-poppins overflow-hidden">
      <div>
        <Navbar />
      </div>
      <div className={styles.appbody}>
        <ul className={styles.tasklist}>
          <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            {
            lists.map((List: TaskList, Index: number) => {
              return <li key={List.id}>
                <taskListContext.Provider value={taskListContextValue}>
                <TaskListComponent list={List} index={Index} />
                </taskListContext.Provider>
                </li>
            })}
          </DndContext>
          <li className="h-fit w-fit" onClick={() => setNList(true)}>
            <NewThingBtn label="Nova Lista"/>
          </li>
        </ul>
      </div>
      <AnimatePresence>
      {isEdit && (
        <updateTaskContext.Provider value={updateTaskContextValue}>
        <motion.div className="absolute top-0 right-0" initial={{x: '100%'}} animate={{x: '0'}} exit={{x: '100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
          <EditTask />
        </motion.div>
        </updateTaskContext.Provider>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {isNList && (
        <createListContext.Provider value={createListContextValue}>
        <motion.div className="absolute top-0 right-0" initial={{x: '100%'}} animate={{x: '0'}} exit={{x: '100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
          <NewList placeholder="" isEdit={isLEdit}/>
        </motion.div>
        </createListContext.Provider>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {isNTask && (
        <createTaskContext.Provider value={createTaskContextValue}>
        <motion.div className="absolute top-0 right-0" initial={{x: '100%'}} animate={{x: '0'}} exit={{x: '100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
          <NewTask />
        </motion.div>
        </createTaskContext.Provider>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {isLEdit && (
        <updateListContext.Provider value={updateListContextValue}>
        <motion.div className="absolute top-0 right-0" initial={{x: '100vw'}} animate={{x: '0'}} exit={{x: '100vw'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
          <NewList placeholder={targetList.title} isEdit={isLEdit}/>
        </motion.div>
        </updateListContext.Provider>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {isSuccesModal && (
          <modalContext.Provider value={modalContextValue}>
          <motion.div className="absolute top-[20px] left-1/2 -translate-x-1/2" initial={{y: '-100%'}} animate={{y: '0'}} exit={{y: '-100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
            <SuccessModal text={modalText}/>
          </motion.div>
          </modalContext.Provider>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDenialModal && (
          <modalContext.Provider value={modalDenContextValue}>
          <motion.div className="absolute top-[20px] left-1/2 -translate-x-1/2" initial={{y: '-100%'}} animate={{y: '0'}} exit={{y: '-100%'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
            <DenialModal text={modalText}/>
          </motion.div>
          </modalContext.Provider>
        )}
      </AnimatePresence>

        {isConfirmation && (
          <modalContext.Provider value={confirmContextValue}>
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-[5000]">
            <ConfirmModal text={confirmText}/>
          </div>
          </modalContext.Provider>
        )}

        <AnimatePresence>
        {isTPanel && (
          <taskListContext.Provider value={taskListContextValue}>
          <motion.div className="absolute top-0 right-0 z-[1000]" initial={{x: '100vw'}} animate={{x: '0'}} exit={{x: '100vw'}} transition={{type: 'tween', duration:0.5, ease: 'easeOut'}}>
            <TaskPanel task={targetTask} listId={TaskListID.current}/>
          </motion.div>
          </taskListContext.Provider>
        )}
        </AnimatePresence>
    </div>
  )
}

export default App
