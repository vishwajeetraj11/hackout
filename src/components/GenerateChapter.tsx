"use client";
import React from "react";
import { Button } from "./ui/button";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ChapterCard from "./ChapterCard";

type Props = {
  chapterTitles: { content: string; id: string }[];
  ebookTitle: string;
  completedChapters: string[];
  setCompletedChapters: React.Dispatch<React.SetStateAction<string[]>>;
  setShouldFetchContent: React.Dispatch<React.SetStateAction<boolean>>;
  shouldFetchContent: boolean;
  onDelete: (chapterTitle: string) => void;
  setIndexes: React.Dispatch<
    React.SetStateAction<
      {
        content: string;
        id: string;
      }[]
    >
  >;
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
    setIndexes,
  } = props;

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }
    setIndexes((chapterTitles) => {
      const oldIndex = chapterTitles.findIndex(
        (chapter) => chapter.id === active.id
      );

      const newIndex = chapterTitles.findIndex(
        (chapter) => chapter.id === over.id
      );

      return arrayMove(chapterTitles, oldIndex, newIndex);
    });
  };

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={chapterTitles}
          strategy={verticalListSortingStrategy}
        >
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
        onClick={() => setShouldFetchContent(true)}
      >
        Generate Chapters
      </Button>
    </>
  );
};

export default ChapterGenerate;
