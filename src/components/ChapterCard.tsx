import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Eye, Loader, RefreshCcw, XCircle } from "lucide-react";
import { Cormorant } from "next/font/google";
import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const cormorant = Cormorant({ subsets: ["latin"] });

type Props = {
  chapter: { content: string; id: string };
  ebookTitle: string;
  shouldFetchContent: boolean;
  completedChapters: string[];
  setCompletedChapters: React.Dispatch<React.SetStateAction<string[]>>;
  onDelete: (chapterTitle: string) => void;
};

const ChapterCard = ({
  chapter,
  ebookTitle,
  shouldFetchContent,
  setCompletedChapters,
  onDelete,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chapter.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const { data, isSuccess, isLoading, refetch, isFetched, isRefetching } =
    useQuery({
      queryKey: ["Chapter Content", ebookTitle, chapter.content],
      enabled: shouldFetchContent,
      queryFn: async () => {
        const data = await axios.post("/api/generateChapterInfo", {
          chapterTitle: chapter.content,
          ebookTitle,
        });
        if (data.data.chapterContent) {
          setCompletedChapters((prev) => {
            const chaptersSet = new Set(prev);
            chaptersSet.add(chapter.content);
            return Array.from(chaptersSet);
          });
        }
        return data;
      },
    });

  return (
    <div className="flex items-center justify-between mb-5 last:mb-0">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="mb-3 font-normal text-gray-700 dark:text-gray-400y"
      >
        <p className={cn(cormorant.className)}>{chapter.content}</p>
      </div>
      <div className="ml-auto flex gap-2">
        {(isLoading || isRefetching) && <Loader />}
        {isSuccess && !isRefetching && (
          <Link href={`#chapter-${chapter.content}`}>
            <Eye />
          </Link>
        )}
        {/* Only Enable Reload button after the content has been generated once. */}
        {isFetched && (
          <RefreshCcw
            onClick={() => {
              refetch();
            }}
            className="cursor-pointer"
          />
        )}
        {isSuccess && !isRefetching && (
          <XCircle onClick={(e) => onDelete(chapter.content)} />
        )}
      </div>
    </div>
  );
};

export default ChapterCard;
