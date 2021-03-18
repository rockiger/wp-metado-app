export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  DateTime: any
}

export type Board = {
  __typename?: 'Board'
  id: Scalars['ID']
  columns: Array<Column>
  isDeleted: Scalars['Boolean']
  projects: Array<Project>
  showBacklog: Scalars['Boolean']
  title: Scalars['String']
  createdBy: User
  updatedBy: User
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
  tasks: Array<Maybe<Task>>
}

export type Column = {
  __typename?: 'Column'
  id: Scalars['ID']
  taskIds: Array<Scalars['String']>
  title: Scalars['String']
  noOfTasksToShow?: Maybe<Scalars['Int']>
}

export type Task = {
  __typename?: 'Task'
  id: Scalars['ID']
  description?: Maybe<Scalars['String']>
  finishedAt?: Maybe<Scalars['DateTime']>
  title: Scalars['String']
  createdBy: User
  updatedBy: User
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type Project = {
  __typename?: 'Project'
  id: Scalars['ID']
  title: Scalars['String']
  type: Scalars['String']
  createdBy: User
  updatedBy: User
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
  meta?: Maybe<ProjectMeta>
}

export type ProjectMeta = {
  __typename?: 'ProjectMeta'
  fullname?: Maybe<Scalars['String']>
}

export type User = {
  __typename?: 'User'
  Id: Scalars['ID']
  activeBoard: Board
  databaseId: Scalars['Int']
  email: Scalars['String']
  githubToken?: Maybe<Scalars['String']>
  firstName: Scalars['String']
  lastName: Scalars['String']
}

/* --- STATE --- */
export interface DatabaseState {
  addingProjectStatus: LoadingStatus
  authUser: AuthUser
  board: Board
  boardStatus: LoadingStatus
  error: any
  projects: ProjectMap
  user: User
  tasks: TaskMap
}

export interface AuthUser {
  email: string
  displayName: string
  photoURL: string
  uid: string
}

/* export interface Column {
  taskIds: string[]
  title: string
  noOfTasksToShow?: 15 | 30 | 0 | undefined
} */

export type LoadingStatus = 'init' | 'fetching' | 'error' | 'success'

export interface ProjectMap {
  [key: string]: Project
}

export interface TaskMap {
  [key: string]: Task
}

export enum TaskState {
  Backlog = 'Backlog',
  Todo = 'Todo',
  Doing = 'Doing',
  Done = 'Done',
}
