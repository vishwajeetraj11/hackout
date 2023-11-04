"use client";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

import html2pdf from "html-to-pdf-js";
import dynamic from "next/dynamic";
import { Cormorant, Sorts_Mill_Goudy } from "next/font/google";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";

const cormorant = Cormorant({ subsets: ["latin"] });
const sortsMillGoudy = Sorts_Mill_Goudy({ subsets: ["latin"], weight: "400" });

type Props = {
  chapterTitles: { content: string; id: string }[];
  ebookTitle: string;
  completedChapters: string[];
  setCompletedChapters: React.Dispatch<React.SetStateAction<string[]>>;
  setShouldFetchContent: React.Dispatch<React.SetStateAction<boolean>>;
};

const Ebook = (props: Props) => {
  const {
    chapterTitles,
    ebookTitle,
    completedChapters,
    setShouldFetchContent,
  } = props;
  const queryClient = useQueryClient();
  const [chaptersInfo, setChaptersInfo] = useState<{ [key: string]: string }>();
  const [htmlToPdf, setHtmlToPdf] = useState<any>();

  const getData = useCallback(() => {
    const chapterContent: { [key: string]: string } = {};
    chapterTitles.forEach((chapter) => {
      const data = queryClient.getQueryData([
        "Chapter Content",
        ebookTitle,
        chapter.content,
      ]) as any;
      if (data) {
        chapterContent[chapter.content] = data?.data?.chapterContent.content;
      }
    });
    setChaptersInfo(chapterContent);
  }, [chapterTitles, ebookTitle]);

  useEffect(() => {
    if (chapterTitles.length === completedChapters.length) {
      setShouldFetchContent(false);
      getData();
    }
  }, [chapterTitles, completedChapters, getData]);

  return (
    <div>
      <div className="flex justify-between">
        <button className="hidden" type="button" onClick={() => getData()}>
          get data
        </button>
        <Button
          className="ml-auto"
          onClick={() => {
            var element = document.getElementById("chapters");

            // html2pdf(element, {
            //   fileName: ebookTitle,
            //   margin: [10, 20, 10, 20],
            //   mode: "css",
            //   pagebreak: { after: [".break-page"] },
            // });
            const fileName = ebookTitle
              .replace(/[^\w\s]/gi, "")
              .replace(/ /g, "-")
              .toLowerCase();

            html2pdf()
              .from(element)
              .set({
                margin: [10, 20, 10, 20],
                mode: "css",
                pagebreak: { after: [".break-page"] },

                jsPDF: {
                  autoPaging: "text",
                  unit: "pt",
                  format: "letter",
                  orientation: "portrait",
                },
              })
              .toPdf()
              .get("pdf")
              .then(function (pdf: any) {
                var totalPages = pdf.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                  pdf.setPage(i);
                  pdf.setFontSize(10);
                  pdf.setTextColor(100);
                  pdf.text(
                    "Page " + i + " of " + totalPages,
                    pdf.internal.pageSize.getWidth() / 2.3,
                    pdf.internal.pageSize.getHeight() - 1
                  );
                }
              })
              .save(fileName);
          }}
        >
          Download PDF
        </Button>
      </div>
      <div id="chapters">
        <div className={cn("my-4", "break-page")}>
          <p
            className="text-center text-xl"
            style={{
              fontFamily: sortsMillGoudy.style.fontFamily,
            }}
          >
            Index of Contents
          </p>
          {chaptersInfo
            ? Object.entries(chaptersInfo).map(([key, value], i) => (
                <>
                  <p
                    className="text-lg mt-5"
                    style={{
                      fontFamily: cormorant.style.fontFamily,
                    }}
                  >
                    {key}
                  </p>
                </>
              ))
            : null}
        </div>
        {chaptersInfo
          ? Object.entries(chaptersInfo).map(([key, value], i) => {
              return (
                <div
                  id={`chapter-${key}`}
                  className={cn("my-4 scroll-mt-3", {
                    "break-page": i !== Object.entries(chaptersInfo).length - 1,
                  })}
                  key={i}
                >
                  <p
                    className="text-center text-xl"
                    style={{
                      fontFamily: sortsMillGoudy.style.fontFamily,
                    }}
                  >
                    {key}
                  </p>
                  <p
                    className="text-lg mt-5"
                    style={{
                      fontFamily: cormorant.style.fontFamily,
                    }}
                  >
                    {value}
                  </p>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Ebook), { ssr: false });
