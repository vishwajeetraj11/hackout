"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useState } from "react";

import Ebook from "@/components/Ebook";
import ChapterGenerate from "@/components/GenerateChapter";
import { Button } from "@/components/ui/button";
import useEbookStore from "@/stores/ebookStore";
import { useMutation } from "@tanstack/react-query";
import { v4 } from "uuid";
import { useShallow } from "zustand/react/shallow";

type Props = {};

const GenerateIndex = (props: Props) => {
  const [chapterTitles, setIndexes] = React.useState<
    { content: string; id: string }[]
  >([]);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [shouldFetchContent, setShouldFetchContent] = useState(false);

  const { title, setTitle } = useEbookStore(
    useShallow((store) => ({ title: store.title, setTitle: store.setTitle }))
  );

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

      <div className="px-12">
       {/* <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={chapters} strategy={verticalListSortingStrategy}>
            {chapters.map((chapter) => (
              <SortableChapter key={chapter} chapter={chapter} />
            ))}
          </SortableContext>
        </DndContext>*/}

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
