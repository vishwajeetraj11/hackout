"use client";
import React from "react";
import ChapterCard from "./ChapterCard";
import { Button } from "./ui/button";

import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  chapterTitles: { content: string }[];
  ebookTitle: string;
  completedChapters: string[];
  setCompletedChapters: React.Dispatch<React.SetStateAction<string[]>>;
  setShouldFetchContent: React.Dispatch<React.SetStateAction<boolean>>;
  shouldFetchContent: boolean;
  onDelete: (chapterTitle: string) => void;
  setIndexes: React.Dispatch<React.SetStateAction<{
    content: string;
}[]>> 
};

const ChapterGenerate = (props: Props) => {
  const {
    chapterTitles,
    ebookTitle,
    completedChapters,
    setCompletedChapters,
    setShouldFetchContent,
    shouldFetchContent,
    onDelete,
    setIndexes
  } = props;

  const onDragEnd = (event) => {
    console.log("onDragEnd", event);
    const { active, over } = event;
      if (active.id === over.id) {
        return;
      }
      setIndexes((chapterTitles) => {
        const oldIndex = chapterTitles.findIndex((chapter) => chapter.id === active.id);
        const newIndex = chapterTitles.findIndex((chapter) => chapter.id === over.id);
        return arrayMove(chapterTitles, oldIndex, newIndex);
      });
  };

  return (
    <>
     <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={chapterTitles} strategy={verticalListSortingStrategy}>
          {chapterTitles.map((chapter, i) => {
            return (
              <ChapterCard
                completedChapters={props.completedChapters}
                setCompletedChapters={props.setCompletedChapters}
                shouldFetchContent={shouldFetchContent}
                ebookTitle={ebookTitle}
                chapter={chapter}
                key={i}
                onDelete={onDelete}
              />
            );
          })}
        </SortableContext>
      </DndContext>
      <Button
        variant={"default"}
        className="mt-5"
        type="button"
        // onClick={generateChapterItems}
        onClick={() => setShouldFetchContent(true)}
      >
        Generate Content
      </Button>
    </>
  );
};

export default ChapterGenerate;
