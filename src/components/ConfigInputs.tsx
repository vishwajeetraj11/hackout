import useEbookStore from "@/stores/ebookStore";
import { Label } from "@radix-ui/react-label";
import { useShallow } from "zustand/react/shallow";
import { Input } from "./ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LanguageStyleUnion,
  PointOfViewUnion,
  ToneOfChaptersUnion,
} from "@/lib/gpt";

const ConfigInputs = () => {
  const {
    title,
    setTitle,
    languageStyle,
    toneOfChapters,
    setLanguageStyle,
    setToneOfChapters,
    pointOfView,
    setPointOfView,
  } = useEbookStore(
    useShallow((store) => ({
      title: store.title,
      setTitle: store.setTitle,
      languageStyle: store.languageStyle,
      toneOfChapters: store.toneOfChapters,
      setLanguageStyle: store.setLanguageStyle,
      setToneOfChapters: store.setToneOfChapters,
      pointOfView: store.pointOfView,
      setPointOfView: store.setPointOfView,
    }))
  );

  return (
    <div className="mb-3">
      <div>
        <Label className="mb-3 block">Title</Label>
        <Input
          placeholder="Enter title of book"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex justify-between mt-5 items-center">
        <div>
          {/* <Label className="mb-2 block text-sm">Language Style</Label> */}
          <Select
            value={languageStyle}
            onValueChange={(val: LanguageStyleUnion) => {
              setLanguageStyle(val);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="storytelling">Story Telling</SelectItem>
              <SelectItem value="informative">Informative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          {/* <Label className="mb-2 block text-sm">Tone of the chapters</Label> */}
          <Select
            value={toneOfChapters}
            onValueChange={(val: ToneOfChaptersUnion) => {
              setToneOfChapters(val);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tone of Chapters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="conversational">Conversational</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          {/* <Label className="mb-2 block text-sm">Point of View</Label> */}
          <Select
            value={pointOfView}
            onValueChange={(val: PointOfViewUnion) => {
              setPointOfView(val);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Point Of View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first-person">First Person</SelectItem>
              <SelectItem value="third-person">Third person</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ConfigInputs;
