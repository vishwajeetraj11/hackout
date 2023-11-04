import { LanguageStyleUnion, PointOfViewUnion, ToneOfChaptersUnion } from '@/lib/gpt';
import { create } from 'zustand';

interface EBookStore {
    title: string,
    setTitle: (title: string) => void;
    languageStyle: LanguageStyleUnion | '',
    setLanguageStyle: (languageStyle: LanguageStyleUnion | '') => void;
    toneOfChapters: ToneOfChaptersUnion | '',
    setToneOfChapters: (toneOfChapters: ToneOfChaptersUnion | '') => void;
    pointOfView: PointOfViewUnion | '',
    setPointOfView: (pointOfView: PointOfViewUnion | '') => void;
}

const useEbookStore = create<EBookStore>()((set) => ({
    title: '',
    setTitle: (title) => set({ title }),
    languageStyle: '',
    setLanguageStyle: (languageStyle) => set({ languageStyle }),
    toneOfChapters: '',
    setToneOfChapters: (toneOfChapters) => set({ toneOfChapters }),
    pointOfView: '',
    setPointOfView: (pointOfView) => set({ pointOfView }),
}))

export default useEbookStore