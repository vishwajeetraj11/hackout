import { Cormorant, Lora, Merriweather, Raleway, Roboto, Sorts_Mill_Goudy } from "next/font/google";
import { create } from 'zustand';

const cormorant = Cormorant({ subsets: ['latin'] });
const sorts_Mill_Goudy = Sorts_Mill_Goudy({ subsets: ['latin'], weight: '400' });
const raleway = Raleway({ subsets: ['latin'] });
const lora = Lora({ subsets: ['latin'], weight: '400' });
const roboto = Roboto({ subsets: ['latin'], weight: '100' });
const merriweather = Merriweather({ subsets: ['latin'], weight: '400' });

interface EBookStore {
    title: string;
    setTitle: (title: string) => void;
    selectedFonts: { font1: string | null, font2: string | null };
    fonts: {
      cormorant: any;
      sorts_Mill_Goudy: any;
      raleway: any;
      lora: any;
      roboto: any;
      merriweather: any;
    };
    setSelectedFonts: (font1: string, font2: string) => void;
}

const useEbookStore = create<EBookStore>((set) => ({
    title: '',
    setTitle: (title) => set({ title }),
    selectedFonts: {
      font1: null,
      font2: null,
    },
    fonts: {
      cormorant,
      sorts_Mill_Goudy,
      raleway,
      lora,
      roboto,
      merriweather,
    },
    setSelectedFonts: (font1, font2) => {
      set((state: { selectedFonts: { font1: string | null, font2: string | null } }) => ({
        selectedFonts: { font1: font1, font2: font2 },
      }));
    }
}));
export default useEbookStore;