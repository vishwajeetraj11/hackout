"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React from "react";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";

import { closestCenter, DndContext } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {};

// const SortableChapter = ({chapter}) => {
//   const { 
//     attributes, 
//     listeners, 
//     setNodeRef, 
//     transform, 
//     transition 
//   } = useSortable({ id: chapter })
//   const style = {
//     transition,
//     transform: CSS.Transform.toString(transform),
//   };

//   return (
//       <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 font-normal text-gray-700 dark:text-gray-400y">
//         {chapter}
//       </div>  
//     )
// }

const GenerateIndex = (props: Props) => {
  const [title, setTitle] = React.useState("");
  const [chapters, setChapters] = React.useState([
    {
        "content": "Unicorn Tales"
    },
    {
        "content": "Dragon Dreams"
    },
    {
        "content": "A Clash of Fantasies"
    },
    {
        "content": "Mystical Creatures Unite"
    },
    {
        "content": "The Legend Lives On"
    },
    {
        "content": "An Enchanted Journey"
    }
]);

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
          console.log(data.data.chapterTitles);
        },
      }
    );
  };

  // const loadTitleChapters = async () => {
  //   try {
  //     const response = await fetch('/ebooks.json');
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch data');
  //     }
  //     const jsonData = await response.json();
  //     const ebooks = jsonData["ebooks"]
  //     const ebook = jsonData.ebooks.find((ebook) => ebook.title === title);
  //     if (ebook) {
  //       console.log(ebook)
  //       setChapters(ebook.chapters);
  //     }
  //     else {
  //       console.log("book not found")
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const onDragEnd = (event) => {
  //   console.log("onDragEnd", event);
  // };

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
          Generate Index
        </Button>
      </div>
      <div className="px-12">
       {/* <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={chapters} strategy={verticalListSortingStrategy}>
            {chapters.map((chapter) => (
              <SortableChapter key={chapter} chapter={chapter} />
            ))}
          </SortableContext>
        </DndContext>*/}
      </div>
    </div>
  );
};

export default GenerateIndex;
