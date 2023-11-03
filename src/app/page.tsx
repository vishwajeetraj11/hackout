"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React from "react";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";

type Props = {};

const GenerateIndex = (props: Props) => {
  const [title, setTitle] = React.useState("");

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
    </div>
  );
};

export default GenerateIndex;
