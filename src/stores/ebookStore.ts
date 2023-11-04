import { create } from 'zustand';

interface EBookStore {
    title: string,
    setTitle: (title: string) => void;
}

const useEbookStore = create<EBookStore>()((set) => ({
    title: '',
    setTitle: (title) => set({ title }),
}))

export default useEbookStore