/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/no-return-void */
import {
  appendFileSync,
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

import { createRandomName } from './helpers';

/**
 * A workspace
 */
export type Workspace = {
  readonly workspaceDir: string;
  readonly workspaceName: string;
  readonly isCreated: boolean;

  /**
   * Create a workspace that is a subdirectory of this workspace
   */
  readonly createSubdirectory: (subdirName?: string) => Workspace;
  readonly trashWorkspace: (recursive?: boolean, force?: boolean) => void;
  readonly resolveFilePath: (filePath: string) => string;
  readonly createFile: (filePath: string, fileContents: any) => void;
  readonly appendFile: (
    filePath: string,
    fileContents: any,
    newLine?: boolean
  ) => void;
  readonly appendLine: (filePath: string, newLine: string) => void;
};

/**
 * Create a new workspace and ensures its directory exists.
 *
 * @param name optional workspace name, leave empty to auto-generate
 * @param parentDir optional parent workspaces dir, leave empty to use $HOME/.workspaces
 *
 * @returns a workspace of type @see Workspace
 */
export const createWorkspace = (
  name?: string,
  parentDir?: string
): Workspace => {
  const workspaceName = name || createRandomName();
  const workspaceDir = join(
    parentDir || resolve(homedir(), '.workspaces'),
    workspaceName
  );

  const existed = existsSync(workspaceDir);

  if (!existed) {
    mkdirSync(workspaceDir, { recursive: true });
  }

  /**
   * Create a workspace that is a subdirectory of this workspace
   *
   * @param subdirName optional subdirectory name, leave empty for a random workspace name
   * @returns a workspace of type @see Workspace
   */
  const createSubdirectory = (subdirName?: string) => {
    return createWorkspace(subdirName, workspaceDir);
  };

  const resolveFilePath = (innerPath?: string) =>
    typeof innerPath === 'undefined'
      ? workspaceDir
      : join(workspaceDir, innerPath);

  const createFile = (filePath: string, fileContents: any) =>
    writeFileSync(resolveFilePath(filePath), fileContents);

  const appendFile = (
    filePath: string,
    fileContents: any,
    newLine?: boolean
  ) => {
    if (!existsSync(resolveFilePath(filePath))) {
      return createFile(filePath, fileContents);
    }

    const fileRef = openSync(resolveFilePath(filePath), 'a');

    appendFileSync(
      fileRef,
      newLine === true ? fileContents + '\n' : fileContents
    );
    closeSync(fileRef);
  };

  const appendLine = (filePath: string, newLine: string) =>
    appendFile(filePath, newLine, true);

  const trashWorkspace = (recursive?: boolean, force?: boolean) =>
    rmSync(workspaceDir, {
      recursive: recursive !== false,
      force: force !== false,
    });

  return {
    workspaceName,
    workspaceDir,
    isCreated: !existed,

    createSubdirectory,
    trashWorkspace,
    resolveFilePath,

    createFile,
    appendFile,
    appendLine,
  };
};
