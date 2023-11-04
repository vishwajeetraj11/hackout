"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useState } from "react";

import Ebook from "@/components/Ebook";
import ChapterGenerate from "@/components/GenerateChapter";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { v4 } from "uuid";

type Props = {};

// const SortableChapter = ({chapter}) => {
// const {
//   attributes,
//   listeners,
//   setNodeRef,
//   transform,
//   transition
// } = useSortable({ id: chapter })
// const style = {
//   transition,
//   transform: CSS.Transform.toString(transform),
// };

//   return (
// <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 font-normal text-gray-700 dark:text-gray-400y">
//   {chapter}
// </div>
//     )
// }

const GenerateIndex = (props: Props) => {
  const [title, setTitle] = React.useState("");

  // const [chapters, setChapters] = React.useState();

  const [chapterTitles, setIndexes] = React.useState<
    { content: string; id: string }[]
  >([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [shouldFetchContent, setShouldFetchContent] = useState(false);

  const { data, mutateAsync } = useMutation({
    mutationKey: ["Index", title],
    mutationFn: async ({ _title }: { _title: string }) => {
      return axios.post("/api/generateIndex", { title: _title, num: 6 });
    },
  });

  const onSubmit = async () => {
    mutateAsync(
      { _title: title },
      {
        onSuccess: (data) => {
          const indexes = data.data.chapterTitles.map((chapter: any) => {
            return { content: chapter.content, id: v4() };
          });
          setIndexes(indexes);
        },
      }
    );
  };

  const onDelete = (chapterTitle: string) => {
    setCompletedChapters((prev) => {
      const chaptersSet = new Set(prev);
      chaptersSet.delete(chapterTitle);
      return Array.from(chaptersSet);
    });
    setIndexes(chapterTitles.filter((ch) => ch.content !== chapterTitle));
  };

  return (
    <div className="p-24 flex gap-5">
      <div className="w-[50%] sticky top-0 h-max">
        <Label className="mb-3 block">Title</Label>

        <Input
          placeholder="Enter title of book"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Button onClick={(e) => onSubmit()} type="button">
          Generate Chapter Names
        </Button>

        {chapterTitles.length > 0 ? (
          <ChapterGenerate
            shouldFetchContent={shouldFetchContent}
            setShouldFetchContent={setShouldFetchContent}
            completedChapters={completedChapters}
            setCompletedChapters={setCompletedChapters}
            ebookTitle={title}
            chapterTitles={chapterTitles}
            onDelete={onDelete}
            setIndexes={setIndexes}
          />
        ) : null}
      </div>
      <div className="w-[50%]">
        <Ebook
          setShouldFetchContent={setShouldFetchContent}
          setCompletedChapters={setCompletedChapters}
          completedChapters={completedChapters}
          chapterTitles={chapterTitles}
          ebookTitle={title}
          key={completedChapters.length}
        />
      </div>
    </div>
  );
};

export default GenerateIndex;
