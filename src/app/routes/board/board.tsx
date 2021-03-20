import React from 'react'

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
        projectId
      }
    }
  }
`

var reactPress = { usermeta: { activeBoard: 123823 }, user: { id: 1 } }

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
        {!_.isEmpty(board.projects) &&
          board.columns.map((col) => {
            if (col.title === 'Backlog' && !board.showBacklog) {
              return null
            }
            return <div key={col.id}>Column {col.title}</div>
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
