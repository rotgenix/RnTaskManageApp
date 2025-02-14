import { atom } from "jotai";

export const userAtom = atom<{
    uid: string | null,
    email: string | null,
    name: string | null
}>({
    uid: null,
    email: null,
    name: null
});