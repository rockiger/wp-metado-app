import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import * as _ from 'lodash'
import styled from 'styled-components/macro'
import { RadioCircle } from 'styled-icons/boxicons-regular'
import { GearFill } from 'styled-icons/bootstrap'
import { Github } from 'styled-icons/boxicons-logos'
import GoogleTasksLogoSrc from './google-tasks-logo.png'

import {
  ButtonGroup,
  Card,
  CardFooter,
  CardTitle,
  Label,
  Spacer,
  GroupButton,
} from 'app/components/UiComponents'
import {
  useMenuState,
  MenuItem,
  MenuButton,
  MenuVertical,
} from 'app/components/UiComponents/Menu'
import {
  Column as ColumnType,
  ProjectMap,
  Task as TaskType,
  TaskMap,
} from 'app/types'

interface Props {
  col: ColumnType
  handleClickTask: (task: TaskType) => void
  projects: ProjectMap
  setNoOfTasksToShow: (colTitle: string, noOfTasks: number) => void
  tasks: TaskMap
}

export function BoardColumn({
  col,
  handleClickTask,
  projects,
  setNoOfTasksToShow,
  tasks,
}: Props): JSX.Element {
  return (
    <Column key={col.title}>
      <ColumnTitle>
        <ColumnIcon size="2rem" />
        {col.title}
        <span style={{ padding: '0.25rem' }} />
        {col.title === 'Done' && (
          <DoneColumnMenu
            colTitle={col.title}
            noOfTasksToShow={15 /*col.noOfTasksToShow*/}
            setNoOfTasksToShow={setNoOfTasksToShow}
          />
        )}
        <Spacer />
        <Label round>{col.taskIds.length}</Label>
      </ColumnTitle>
      {col.taskIds.map((id, index) => {
        const task = tasks[id]
        if (!task) {
          return null
        }
        const project = projects[task.projectId]
        return (
          <Task key={id} onClick={() => handleClickTask(task)}>
            <CardTitle>{task.title}</CardTitle>
            <CardFooter>
              <Spacer />
              {project.type === 'github' && (
                <Label color="black">
                  <GithubLogo size="1.5rem" />
                  {project.title}
                </Label>
              )}
              {project.type === 'googletasks' && (
                <Label color="#3f8ef1">
                  <LogoWrapper>
                    <LogoImg src={GoogleTasksLogoSrc} alt="Google Tasks Logo" />
                  </LogoWrapper>
                  {project.title}
                </Label>
              )}
            </CardFooter>
          </Task>
        )
      })}
    </Column>
  )
}

export function DoneColumnMenu({
  colTitle,
  noOfTasksToShow,
  setNoOfTasksToShow,
}: {
  colTitle: string
  noOfTasksToShow: 15 | 30 | 0 | undefined
  setNoOfTasksToShow: (colTitle: string, noOfTasks: number) => void
}) {
  const menu = useMenuState({ orientation: 'vertical' })
  return (
    <>
      <MenuButton {...menu}>
        <GearFill size="1.5rem" />
      </MenuButton>
      <MenuVertical {...menu} aria-label="Preferences">
        <MenuItem as="div" {...menu}>
          <DoneColumMenuItemContent>Show</DoneColumMenuItemContent>
          <ButtonGroup>
            <GroupButton
              aria-selected={noOfTasksToShow === 15}
              onClick={() => onClickNoOfTasks(15)}
            >
              15
            </GroupButton>
            <GroupButton
              aria-selected={noOfTasksToShow === 30}
              onClick={() => onClickNoOfTasks(30)}
            >
              30
            </GroupButton>
            <GroupButton
              aria-selected={
                noOfTasksToShow === 0 || noOfTasksToShow === undefined
              }
              onClick={() => onClickNoOfTasks(0)}
            >
              All
            </GroupButton>
          </ButtonGroup>
        </MenuItem>
      </MenuVertical>
    </>
  )

  function onClickNoOfTasks(noOfTasks) {
    console.log(noOfTasks)
    setNoOfTasksToShow(colTitle, noOfTasks)
  }
}

const DoneColumMenuItemContent = styled(Spacer)`
  margin-right: 3rem;
  margin-top: -2px;
`

const Column = styled.div`
  background-color: white;
  min-height: 16rem;
  padding: 1.6rem;
  width: 33%;
`

const ColumnTitle = styled.h2`
  align-items: center;
  display: flex;
  font-size: 2rem;
  font-weight: 400;
  margin: 0;
  padding: 1.6rem 0 3.2rem;
`

const ColumnIcon = styled(RadioCircle)`
  color: lightgrey};
  margin-right: 0.3rem;
`

const Tasks = styled.div`
  min-height: 10rem;
`

const Task = styled(Card)`
  padding: 1.6rem;
  &:hover {
    box-shadow: rgb(0 0 0 / 10%) 0px 1px 8px 0px,
      rgb(0 0 0 / 7%) 0px 3px 4px 0px, rgb(0 0 0 / 6%) 0px 3px 3px -2px;
  }
  &:last-child {
    margin-bottom: 1.6rem;
  }
`

const GithubLogo = styled(Github)`
  padding-right: 0.2rem;
`

const LogoImg = styled.img`
  width: 1.5rem;
`

const LogoWrapper = styled.span`
  border-radius: 100%;
  display: inline-block;
  height: 1.5rem;
  line-height: 1;
  margin-right: 0.2rem;
  vertical-align: middle;
`
