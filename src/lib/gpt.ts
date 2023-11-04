import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export type LanguageStyleUnion = 'academic' | 'storytelling' | 'informative'
export type ToneOfChaptersUnion = 'formal' | 'conversational' | 'technical'
export type ContentLengthUnion = 'short' | 'medium' | 'long'
export type PointOfViewUnion = 'first-person' | 'third-person'

export type EbookParamsType = {
    languageStyle?: Omit<LanguageStyleUnion, string>,
    audience?: Omit<ToneOfChaptersUnion, string>,
    contentLength?: Omit<ContentLengthUnion, string>,
    pointOfView?: Omit<PointOfViewUnion, string>
}


export const generateIndex = async (title: string, num?: number, options?: EbookParamsType, prompt?: string) => {
    try {
        const defaultLanguageStyle = options?.languageStyle || 'academic';
        const defaultAudience = options?.audience || 'formal';
        const defaultPointOfView = options?.pointOfView || 'third-person';

        const response = await strict_output(
            prompt || `You are a helpful AI that is able to generate a chapter title in an ebook, The length of each chapter title should not be more than 15 words. These are some parameters that should be considered: Language Style: '${defaultLanguageStyle}', Tone of Content: ${defaultAudience}, Point of View: ${defaultPointOfView}. The context is following title: ${title}`,
            new Array(num || 10).fill(
                `You are to generate a chapter title in an ebook.`
            ),
            {
                content: 'A chapter title in an ebook.'
            }
        );

        /*
        Language Style = academic, storytelling, informative

        [] Audience and Tone:
            Determine the intended audience (age group, knowledge level, etc.) and the tone (formal, conversational, technical,   etc.) appropriate for the ebook.
        
        [] Content Length and Depth:
            Specify the desired length of the ebook and the depth of information needed for each section.

        [x] Language Style and Consistency:
            Specify the language style (academic, storytelling, informative) and ensure consistency in language and terminology throughout the content.

        [x] Narrative Voice and Point of View: 
            Clarify the preferred narrative voice (first-person, third-person) or the point of view to be used within the content.
        */

        return response

    } catch (e) {
        console.error(e);
        throw new Error("Something went wrong!");
    }
}


export const generateChapterInfo = async (ebookTitle: string, chapterTitle: string, options?: EbookParamsType, prompt?: string) => {

    const defaultLanguageStyle = options?.languageStyle || 'academic';
    const defaultAudience = options?.audience || 'formal';
    const defaultPointofView = options?.pointOfView || 'third-person';

    try {
        const response = await strict_output(
            prompt || `You are an educated author that is able to generate a chapter content from a chapter title for an ebook. These are some parameters that should be considered: Language Style: '${defaultLanguageStyle}', Tone of the content: '${defaultAudience}', Point of View: ${defaultPointofView}. Start with the contents of the chapter not like Chapter X: title here goes or content is here.`,
            `Title of the ebook: ${ebookTitle}, and chapter title: ${chapterTitle}`,
            {
                content: 'contents of the chapter'
            }
        );

        return response

    } catch (e) {
        console.error(e);
        throw new Error("Something went wrong!");
    }
}


interface OutputFormat {
    [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
    system_prompt: string,
    user_prompt: string | string[],
    output_format: OutputFormat,
    default_category: string = "",
    output_value_only: boolean = false,
    model: string = "gpt-3.5-turbo",
    temperature: number = 1,
    num_tries: number = 3,
    verbose: boolean = false
) {
    // if the user input is in a list, we also process the output as a list of json
    const list_input: boolean = Array.isArray(user_prompt);
    // if the output format contains dynamic elements of < or >, then add to the prompt to handle dynamic elements
    const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
    // if the output format contains list elements of [ or ], then we add to the prompt to handle lists
    const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));

    // start off with no error message
    let error_msg: string = "";

    for (let i = 0; i < num_tries; i++) {
        let output_format_prompt: string = `\nYou are to output ${list_output && "an array of objects in"
            } the following in json format: ${JSON.stringify(
                output_format
            )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

        if (list_output) {
            output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
        }

        // if output_format contains dynamic elements, process it accordingly
        if (dynamic_elements) {
            output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
        }

        // if input is in a list format, ask it to generate json in a list
        if (list_input) {
            output_format_prompt += `\nGenerate an array of json, one json for each input element.`;
        }

        // Use OpenAI to get a response
        const response = await openai.chat.completions.create({
            temperature: temperature,
            model: model,
            messages: [
                {
                    role: "system",
                    content: system_prompt + output_format_prompt + error_msg,
                },
                { role: "user", content: user_prompt.toString() },
            ],
        });

        let res: string =
            response.choices[0].message?.content?.replace(/'/g, '"') ?? "";
        //   response.data.choices[0].message?.content?.replace(/'/g, '"') ?? "";

        // ensure that we don't replace away apostrophes in text
        res = res.replace(/(\w)"(\w)/g, "$1'$2");

        if (verbose) {
            console.log(
                "System prompt:",
                system_prompt + output_format_prompt + error_msg
            );
            console.log("\nUser prompt:", user_prompt);
            console.log("\nGPT response:", res);
        }

        // try-catch block to ensure output format is adhered to
        try {
            let output: any = JSON.parse(res);

            if (list_input) {
                if (!Array.isArray(output)) {
                    throw new Error("Output format not in an array of json");
                }
            } else {
                output = [output];
            }

            // check for each element in the output_list, the format is correctly adhered to
            for (let index = 0; index < output.length; index++) {
                for (const key in output_format) {
                    // unable to ensure accuracy of dynamic output header, so skip it
                    if (/<.*?>/.test(key)) {
                        continue;
                    }

                    // if output field missing, raise an error
                    if (!(key in output[index])) {
                        throw new Error(`${key} not in json output`);
                    }

                    // check that one of the choices given for the list of words is an unknown
                    if (Array.isArray(output_format[key])) {
                        const choices = output_format[key] as string[];
                        // ensure output is not a list
                        if (Array.isArray(output[index][key])) {
                            output[index][key] = output[index][key][0];
                        }
                        // output the default category (if any) if GPT is unable to identify the category
                        if (!choices.includes(output[index][key]) && default_category) {
                            output[index][key] = default_category;
                        }
                        // if the output is a description format, get only the label
                        if (output[index][key].includes(":")) {
                            output[index][key] = output[index][key].split(":")[0];
                        }
                    }
                }

                // if we just want the values for the outputs
                if (output_value_only) {
                    output[index] = Object.values(output[index]);
                    // just output without the list if there is only one element
                    if (output[index].length === 1) {
                        output[index] = output[index][0];
                    }
                }
            }

            return list_input ? output : output[0];
        } catch (e) {
            error_msg = `\n\nResult: ${res}\n\nError message: ${e}`;
            console.log("An exception occurred:", e);
            console.log("Current invalid json format ", res);
        }
    }

    return [];
}