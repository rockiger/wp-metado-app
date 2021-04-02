import React from 'react'

import { gql, useMutation, useQuery } from '@apollo/client'
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

import { Board, Project, ProjectMap, Task, TaskMap } from 'app/types'
import { BoardColumn } from './BoardColumn'
import { AddCard } from './AddTask'
import { client } from 'index'

interface BoardPageData {
  board: Board
}

const BOARD = gql`
  query Board($id: Int!) {
    board(id: $id) {
      id
      title
      showBacklog
      columns {
        title
        taskIds
      }
      projects {
        id
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
        projectId
      }
    }
  }
`

// https://graphql.org/learn/queries/
// https://www.apollographql.com/docs/react/
const SHOWBACKLOG = gql`
  mutation ShowBacklog($id: Int!, $showBacklog: Boolean = true) {
    __typename
    updateBoard(input: { id: $id, showBacklog: $showBacklog }) {
      __typename
      id
    }
  }
`

var reactPress = { usermeta: { activeBoard: 1 }, user: { id: 1 } }

export function BoardPage() {
  const [showBacklog] = useMutation(SHOWBACKLOG, {
    update: (cache, data) => {
      console.log({ cache, data })
      const { board } = cache.readQuery({ query: BOARD, variables: query.variables }) ?? {}
      console.log(query)
      client.writeQuery({
        query: BOARD,
        data: {
          board: { ...board.board, showBacklog: !board.showBacklog },
        },
        variables: query.variables
      })
    },
  })
  const query = useQuery<BoardPageData, any>(BOARD, {
    variables: { id: reactPress.usermeta.activeBoard },
  })
  const editDialogFinalFocusRef = React.useRef<HTMLElement>(null)

  const { loading, error, data, previousData } = query

  /*  console.table(data?.board)
  console.log(reactPress) */

  if (loading) return <p>Loading...</p>
  if (error) console.log(error)
  if (error) return <p>Error :(</p>

  const board = data?.board ?? previousData?.board
  if (!board) return <p>No board</p>

  return (
    <Page>
      <PageHeader>
        <PageTitle>{board?.title}</PageTitle>
        <ToggleButton
          isActive={board.showBacklog}
          onClick={() => 
            showBacklog({
              variables: { id: board.id, showBacklog: !board.showBacklog },
              optimisticResponse: {
                __typename: "RootMutation",
                 updateBoard: {
                   __typename: "UpdateBoardPayload",
                   id: 1
                }
              }
            })
          }
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
        {!_.isEmpty(board.projects) &&
          [
            board.columns[1],
            board.columns[2],
            board.columns[3],
            board.columns[0],
          ].map((col) => {
            if (col.title === 'Backlog' && !board.showBacklog) {
              return null
            }
            return (
              <BoardColumn
                col={col}
                handleClickTask={(task: Task) => {}}
                projects={createProjectMap(board.projects)}
                setNoOfTasksToShow={(colTitle: string, noOfTasks: number) => {}}
                tasks={createTaskMap(board.tasks)}
              />
            )
          })}

        {board.id && _.isEmpty(board.projects) && (
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
}

const createTaskMap = (taskList: Task[]): TaskMap => _.keyBy(taskList, 'id')
const createProjectMap = (projectList: Project[]): ProjectMap =>
  _.keyBy(projectList, 'id')

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
