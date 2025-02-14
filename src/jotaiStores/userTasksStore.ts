import { atom } from "jotai";

export interface taskInterface {
    completed: boolean,
    createdAt: string,
    description: string,
    dueDate: Date,
    id: string,
    priority: "Low" | "Medium" | "High",
    title: string,
    uid: string,
}

export const userTaskAtom = atom<taskInterface[]>([]);