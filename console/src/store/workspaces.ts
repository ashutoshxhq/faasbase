import { atom } from "recoil";
import { localStorageEffect } from ".";

export interface Workspace {
    id: string
    name: string
    description: string
    team_id: string
    created_at: string
    updated_at: string
};

export const currentWorkspaceState = atom<Workspace | null>({
    key: 'currentWorkspaceState',
    default: null,
    effects: [
        localStorageEffect('current_workspace'),
      ]
});