import { generateChapterInfo } from "@/lib/gpt";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
    try {
        const body = await req.json();
        const chapterContent = await generateChapterInfo(body.ebookTitle, body.chapterTitle);
        return NextResponse.json({ status: true, message: 'Chapter Info Generated.', chapterTitle: body.chapterTitle, chapterContent }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ status: false, message: 'Something went worng!' }, { status: 400 });
    }
}