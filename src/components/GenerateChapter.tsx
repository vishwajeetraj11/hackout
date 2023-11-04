"use client";
import React from "react";
import ChapterCard from "./ChapterCard";
import { Button } from "./ui/button";

type Props = {
  chapterTitles: { content: string }[];
  ebookTitle: string;
  completedChapters: string[];
  setCompletedChapters: React.Dispatch<React.SetStateAction<string[]>>;
  setShouldFetchContent: React.Dispatch<React.SetStateAction<boolean>>;
  shouldFetchContent: boolean;
  onDelete: (chapterTitle: string) => void;
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
  } = props;

  return (
    <>
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
