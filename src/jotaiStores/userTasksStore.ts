import { atom } from "jotai";

export interface taskInterface {
    completed: boolean,
    createdAt: string,
    description: string,
    dueDate: string,
    id: string,
    priority: "Low" | "Medium" | "High",
    title: string,
    uid: string,
}

export const userTaskAtom = atom<taskInterface[]>([]);