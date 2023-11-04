import { generateIndex } from "@/lib/gpt";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
    try {
        const body = await req.json();

        const chapterTitles = await generateIndex(body.title, body.num, body.options, body.prompt);
        return NextResponse.json({ status: true, message: 'Index Generated.', chapterTitles }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ status: false, message: 'Something went worng!' }, { status: 400 });
    }
}