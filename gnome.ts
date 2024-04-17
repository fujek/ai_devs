import {AiDevsClient} from "./ai_devs_client.ts";
import {ChatOpenAI, OpenAI} from "@langchain/openai";
import {HumanMessage} from "langchain/schema";

const aiDevsClient = await AiDevsClient.build("gnome");
const task = await aiDevsClient.getTaskMessage();
console.log(task)

const model = new ChatOpenAI({
    modelName: "gpt-4-vision-preview",
});

const response = await fetch(task.url as string);
const arrayBuffer = await response.arrayBuffer()
const buffer = Buffer.from(arrayBuffer);
const base64 = buffer.toString('base64')

const result = await model.invoke([
    new HumanMessage({
        content: [
            {
                type: "text",
                text: task.msg, //"I will give you a drawing of a gnome with a hat on his head. Tell me what is the color of the hat in POLISH. If any errors occur, return \"ERROR\" as answer"
            },
            {
                type: "image_url",
                image_url: {
                    url: `data:image/jpeg;base64,${base64}`,
                },
            },
        ],
    })

]);
console.log(result.content)

await aiDevsClient.sendAnswer(result.content)