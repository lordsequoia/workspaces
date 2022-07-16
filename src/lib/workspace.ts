import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

import { createRandomName } from './helpers'

export type Workspace = {
    readonly rootDir: string
    readonly name: string
}

export const createWorkspace = (name?: string, parentDir?: string): Workspace => {
    const workspaceName = name || createRandomName()
    const workspaceDir = join(parentDir || resolve(homedir(), '.workspaces'), workspaceName)

    return {
        name: workspaceName,
        rootDir: workspaceDir,
    }
}