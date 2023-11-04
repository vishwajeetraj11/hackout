import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import html2pdf from "html-to-pdf-js";
// import { Cormorant, Sorts_Mill_Goudy } from "next/font/google";
import React, { useCallback, useEffect, useState } from "react";
import useEbookStore from "../stores/ebookStore";
import { Button } from "./ui/button";

// const cormorant = Cormorant({ subsets: ["latin"] });
// const sortsMillGoudy = Sorts_Mill_Goudy({ subsets: ["latin"], weight: "400" });

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

  const { selectedFonts, setSelectedFonts, fonts } = useEbookStore();
  const [currentPair, setCurrentPair] = React.useState<{
    font1: any;
    font2: any;
  } | null>(null);

  const handleButtonClick = (font1?: any, font2?: any) => {
    setSelectedFonts(font1, font2);
    setCurrentPair(font1 && font2 ? { font1, font2 } : null);
  };

  const queryClient = useQueryClient();
  const [chaptersInfo, setChaptersInfo] = useState<{ [key: string]: string }>();

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
      <button type="button" onClick={() => getData()}>
        get data
      </button>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div className="mr-1">
          <Button
            onClick={() =>
              handleButtonClick(fonts.cormorant, fonts.sorts_Mill_Goudy)
            }
            className="mr-1"
          >
            A
          </Button>
          <Button
            onClick={() => handleButtonClick(fonts.raleway, fonts.lora)}
            className="mr-1"
          >
            B
          </Button>
          <Button
            onClick={() => handleButtonClick(fonts.roboto, fonts.merriweather)}
            className="mr-1"
          >
            C
          </Button>
          <Button onClick={() => handleButtonClick()} className="mr-1">
            D
          </Button>
          <Button onClick={() => handleButtonClick()} className="mr-1">
            F
          </Button>
        </div>
        <Button
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
              fontFamily: selectedFonts.font2 ? selectedFonts.font2 : undefined,
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
                      fontFamily: selectedFonts.font1
                        ? selectedFonts.font1
                        : undefined,
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
                      fontFamily: selectedFonts.font2
                        ? selectedFonts.font2
                        : undefined,
                    }}
                  >
                    {key}
                  </p>
                  <p
                    className="text-lg mt-5"
                    style={{
                      fontFamily: selectedFonts.font1
                        ? selectedFonts.font1
                        : undefined,
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

export default Ebook;
