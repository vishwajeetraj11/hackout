"use client";
import axios from "axios";
import React, { useState } from "react";

import ConfigInputs from "@/components/ConfigInputs";
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

  const { title, languageStyle, toneOfChapters } = useEbookStore(
    useShallow((store) => ({
      title: store.title,
      setTitle: store.setTitle,
      languageStyle: store.languageStyle,
      toneOfChapters: store.toneOfChapters,
    }))
  );

  const { data, mutateAsync } = useMutation({
    mutationKey: ["Index", title],
    mutationFn: async ({ _title, languageStyle, toneOfChapters }: any) => {
      const data = {
        title: _title,
        options: { languageStyle, toneOfChapters },
        num: 5,
      };
      return axios.post("/api/generateIndex", data);
    },
  });

  const onSubmit = async () => {
    mutateAsync(
      { _title: title, languageStyle, toneOfChapters },
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
        <ConfigInputs />
        <Button className="mb-4" onClick={(e) => onSubmit()} type="button">
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
