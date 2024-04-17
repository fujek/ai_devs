import {AiDevsClient} from "./ai_devs_client.ts";
import {ChatOpenAI} from "@langchain/openai";
import {HumanMessage} from "langchain/schema";

const aiDevsClient = await AiDevsClient.build("gnome");
const task = await aiDevsClient.getTaskMessage();
console.log(task)

const model = new ChatOpenAI({
    modelName: "gpt-4-vision-preview",
});


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
                    url: task.url as string,
                },
            },
        ],
    })

]);
console.log(result.content)
await aiDevsClient.sendAnswer(result.content)