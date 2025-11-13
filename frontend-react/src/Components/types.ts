
export type Task = {
  name: string,
  description: string,
  id: number,
  date: Date
  priority: string,
  finished: boolean
}

export type TaskList = {
  title: string,
  id: number,
  tasklist: Task[]
}

