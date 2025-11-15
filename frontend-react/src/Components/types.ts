

export type Task = {
  name: string,
  description: string,
  id: string,
  date: Date,
  priority: string,
  finished: boolean
}

export type TaskList = {
  title: string,
  id: string,
  tasklist: Task[]
}

