import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'

import { gql, useQuery } from '@apollo/client'
import {
  Button,
  ButtonClear,
  Card,
  Column,
  Page,
  PageHeader,
  PageTitle,
  Row,
  Spacer,
  ToggleButton,
} from 'app/components/UiComponents'
import styled from 'styled-components/macro'
import media from 'styled-media-query'
import { Buffer } from 'styled-icons/simple-icons'

import { Board, Task } from 'app/types'
import { BoardColumn } from './BoardColumn'
import { AddCard } from './AddTask'
import { EditTask } from './EditTask'

interface BoardPageData {
  board: Board
}

const BOARD = gql`
  query {
    board {
      id
      title
      showBacklog
      columns {
        title
        taskIds
      }
      projects {
        title
        type
        meta {
          fullname
        }
      }
      createdAt
      tasks {
        id
        title
        description
        finishedAt
      }
    }
  }
`

var reactPress = { usermeta: { activeBoard: 123823 }, user: { id: 1 } }
const ownerId = reactPress.user.id

export function BoardPage() {
  const query = useQuery<BoardPageData, any>(BOARD)
  const editDialogFinalFocusRef = React.useRef<HTMLElement>(null)

  const { loading, error, data } = query

  console.table(data?.board)
  console.log(reactPress)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  const board = data?.board
  if (!board) return <p>No board</p>

  return (
    <Page>
      <PageHeader>
        <PageTitle>{board?.title}</PageTitle>
        <ToggleButton
          isActive={board?.showBacklog}
          onClick={(ev) => 'toggleBacklog(board, uid)'}
          title={board?.showBacklog ? 'Hide backlog' : 'Show backlog'}
        >
          <Buffer size="1rem" />
        </ToggleButton>
        <Spacer />
        {board?.projects.length < 10 && (
          <>
            <ButtonClear>Add Google Tasks List</ButtonClear>
            <ButtonClear>Add GitHub Repo</ButtonClear>
          </>
        )}
        <AddCard
          board={board}
          handleAddTask={(ev) => console.log(ev)}
          ownerId={reactPress.user.id}
        />
      </PageHeader>
      <BoardContent ref={editDialogFinalFocusRef}>
        {!_.isEmpty(board?.projects) && (
          <>
            <DragDropContext
              onDragEnd={(result) =>
                onDragEnd(result, board, ownerId, board.tasks)
              }
            >
              {board.columns.map((col, index) => {
                if (index === 0 && !board.showBacklog) {
                  return null
                }
                return (
                  <BoardColumn
                    col={col}
                    index={index}
                    key={index}
                    projects={_.keyBy(board.projects, 'id')}
                    tasks={_.keyBy(board.tasks, 'id')}
                    handleClickTask={handleClickTask}
                    setNoOfTasksToShow={setNoOfTasksToShow}
                  />
                )
              })}
            </DragDropContext>
            {/*<EditTask
              dialogState={editDialogState}
              finalFocusRef={editDialogFinalFocusRef}
              handleCancelEdit={() => setEditTaskState(null)}
              handleEditTask={updateTask}
              task={editTaskState}
            />*/}
          </>
        )}
        {/* !activeBoard && !boardId && !board?.id && (
          <div>Preparing your board...</div>
        )*/}
        {/*((status === 'tasksConnected' && !board?.id && boardId) ||
          (ownerId && ownerId !== uid)) && (
          <>
            <div>Couldn't find board</div>
            <p>Go to last used board...</p>
          </>
          )*/}
        {board?.id && _.isEmpty(board.projects) && (
          <Card>
            <Column align="center">
              <h5>
                It seems your board doesn't have any projects attached. Go and
                add one.
              </h5>
              <p>
                <img
                  src="/images/empty.svg"
                  alt="empty box"
                  style={{ width: '40rem' }}
                />
              </p>

              <Button as={Link} to={`/projects/add/googletasks`}>
                Add Google Tasks List
              </Button>
              <p></p>
              <Button as={Link} to={`/projects/add/github`}>
                Add GitHub Project
              </Button>
            </Column>
          </Card>
        )}
      </BoardContent>
    </Page>
  )

  async function addTask(taskData: {
    description: string
    projectId: string
    title: string
  }) {
    /* const project = projects[taskData.projectId]

    // Create task in github and get result
    try {
      let createResult: any
      if (project.type === 'github') {
        createResult = await createIssue(
          profile?.githubToken,
          project,
          taskData
        )
      }
      if (project.type === 'googletasks') {
        createResult = await googletasksConnector.createTask(project, taskData)
      }
      console.log({ createResult, project })
      console.log(createResult?.status)
      if (createResult?.status >= 200 && createResult?.status < 300) {
        let newTaskId = ''
        if (project.type === 'github') {
          newTaskId = `${user?.uid}-${project.type}-${project.owner}-${project.name}-${createResult.data.number}`
        }
        if (project.type === 'googletasks') {
          newTaskId = `${project.id}-${createResult.result.id}`
        }
        // Create task in firesotere-
        console.log({ newTaskId })
        if (newTaskId) {
          const newTask: Task = {
            created: now(),
            edited: now(),
            finished: '',
            id: newTaskId,
            description: taskData.description,
            project: project.id,
            status: TaskState.Backlog,
            title: taskData.title,
            type: project.type,
            user: project.user,
          }
          const taskRef = db.collection('tasks').doc(newTaskId)
          await taskRef.set(newTask)

          // Add Task to column, needs to be after task creation,
          // otherwise we get a type error
          const column = board.columns[0]
          const newTaskIds = produce(column.taskIds, (draftTaskIds) => {
            draftTaskIds.unshift(newTaskId)
          })
          const newColumn = produce(column, (draftColumn) => {
            draftColumn.taskIds = newTaskIds
          })

          const newColumns = produce(board.columns, (draftColumns) => {
            draftColumns[0] = newColumn
          })

          const newBoard = produce(board, (draftBoard) => {
            draftBoard.columns = newColumns
          })

          updateBoard(newBoard, project.user)
        }
      }
    } catch (error) {
      console.error(error)
    }
    */
  }
  function handleClickTask(task: Task) {
    /*setEditTaskState(task)
    editDialogState.show()*/
  }

  async function onDragEnd(
    result: any, //DropResult,
    board: any, //BoardType,
    ownerId: any, //Number,
    tasks: any //TaskMap
  ) {
    /* const dragResult = onDragEndResult(result, board, ownerId, projects, tasks)
    dragResult.forEach(async (el) => {
      console.log(el[0], el[1])
      if (el[0] === 'updateBoard') {
        const { board, uid } = el[1]

        await updateBoard(board, uid)
      }
      if (el[0] === 'updateTask') {
        const { oldTask, task } = el[1]
        await updateTask(oldTask, task)
      }
    })
    */
  }

  async function setNoOfTasksToShow(colTitle, noOfTasks) {
    /*const colNos = { Backlog: 0, Todo: 1, Doing: 2, Done: 3 }
    const colNo = colNos[colTitle]

    const newBoard = produce(board, (draft) => {
      draft.columns[colNo]['noOfTasksToShow'] = noOfTasks
    })
    updateBoard(newBoard, uid)*/
  }

  async function toggleBacklog(board, uid) {
    /*setBoard({ ...board, showBacklog: !board.showBacklog })
    const boardRef = db
      .collection('users')
      .doc(uid)
      .collection('boards')
      .doc(board.id)
    try {
      await boardRef.update({ showBacklog: !board.showBacklog })
    } catch (error) {
      console.error(error)
    }*/
  }

  async function updateBoard(board: any, uid: any) {
    /*
    setBoard(board)
    const boardRef = db
      .collection('users')
      .doc(uid)
      .collection('boards')
      .doc(board.id)
    try {
      await boardRef.set(board)
    } catch (error) {
      console.error(error)
    }
    */
  }

  async function updateTask(oldTask: Task, task: Task) {
    /*
    const project = projects[oldTask.project]
    setTasks({ ...tasks, [task.id]: task })
    console.log({ task })
    const taskRef = db.collection('tasks').doc(task.id)
    try {
      await taskRef.set(task)
      if (task.type === 'github' && profile?.githubToken) {
        if (
          oldTask.status === TaskState.Done &&
          task.status !== TaskState.Done
        ) {
          await openIssue(profile.githubToken, task, project)
        }
        if (
          oldTask.status !== TaskState.Done &&
          task.status === TaskState.Done
        ) {
          await closeIssue(profile.githubToken, task, project)
        }
        if (
          oldTask.title !== task.title ||
          oldTask.description !== task.description
        ) {
          await updateIssue(profile.githubToken, task, project)
        }
      }
      if (task.type === 'googletasks') {
        await googletasksConnector.updateTask(task, project)
      }
    } catch (error) {
      console.error(error)
    }
    */
  }
}

/**
 * Produces an array with the actions to perform to change
 * the state accordingly to the users drag and drop actions .
 * @param result the dropResult from react-beautiful-dnd
 * @param board the current board
 * @param ownerId the owner of the board
 * @param tasks the current tasks
 * @returns the array with the actions
 */
export function onDragEndResult(
  result: any, // DropResult,
  board: any, //BoardType,
  ownerId: number,
  projects: any, // ProjectMap,
  tasks: any //TaskMap
): any {
  //[string, { [key: string]: any }][]
  /*const { destination, source, draggableId } = result
  // nothing changed
  if (
    !destination ||
    (destination.droppableId === source.droppableId &&
      destination.index === source.index)
  ) {
    return []
  }
  const startColumn = board.columns[source.droppableId]
  const finishColumn = board.columns[destination.droppableId]
  const newStatus = finishColumn.title

  // same column
  if (startColumn.title === finishColumn.title) {
    const newTaskIds = produce(startColumn.taskIds, (draftTaskIds) => {
      draftTaskIds.splice(source.index, 1)
      draftTaskIds.splice(destination.index, 0, draggableId)
    })
    const newColumn = produce(startColumn, (draftColumn) => {
      draftColumn.taskIds = newTaskIds
    })

    const newColumns = produce(board.columns, (draftColumns) => {
      draftColumns[source.droppableId] = newColumn
    })

    const newBoard = produce(board, (draftBoard) => {
      draftBoard.columns = newColumns
    })

    return [['updateBoard', { board: newBoard, uid: ownerId }]]
  }

  // moving from one column to another
  const startTaskIds = produce(startColumn.taskIds, (draftTaskIds) => {
    draftTaskIds.splice(source.index, 1)
  })
  const newStartColumn = produce(startColumn, (draftColumn) => {
    draftColumn.taskIds = startTaskIds
  })

  const finishTaskIds = produce(finishColumn.taskIds, (draftTaskIds) => {
    draftTaskIds.splice(destination.index, 0, draggableId)
  })
  const newFinishColumn = produce(finishColumn, (draftColumn) => {
    draftColumn.taskIds = finishTaskIds
  })

  const newColumns = produce(board.columns, (draftColumns) => {
    draftColumns[source.droppableId] = newStartColumn
    draftColumns[destination.droppableId] = newFinishColumn
  })

  const newBoard = produce(board, (draftBoard) => {
    draftBoard.columns = newColumns
  })

  //change state of task
  const oldTask = tasks[draggableId]
  const newTask = produce(oldTask, (draftTask) => {
    draftTask.status = newStatus
    draftTask.edited = new Date().toISOString()
    if (newStatus === 'Done') {
      draftTask.finished = new Date().toISOString()
    }
  })

  return [
    ['updateBoard', { board: newBoard, uid: ownerId }],
    ['updateTask', { oldTask, task: newTask, projects }],
  ]
  */
}

export const BoardContent = styled(Row)<{ ref: any }>`
  align-items: flex-start;
  gap: 1.5rem;
  justify-content: space-evenly;
  overflow: auto;
  padding: 2rem;
  width: 100%;
  ${media.greaterThan('medium')`
    padding: 2rem 4rem;
  `};
`

const Link = styled.a``
