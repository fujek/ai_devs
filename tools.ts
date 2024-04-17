import {AiDevsClient} from "./ai_devs_client.ts";
import {ChatOpenAI, OpenAI} from "@langchain/openai";
import {ConversationChain} from "langchain/chains";
import {HumanMessage, SystemMessage} from "langchain/schema";

const aiDevsClient = await AiDevsClient.build("tools");
const task = await aiDevsClient.getTaskMessage();
console.log(task)

const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
});
const result = await model.invoke([
    new SystemMessage(
        `
            Decide whether the task should be added to the ToDo list or to the calendar (if time is provided) and return the corresponding JSON. 
            Return the JSON in the format shown in the examples.
            
            rules###
            Date has following format: YYYY-MM-DD eg. 2024-04-01
            
            context###
            Today is ${new Date().toLocaleDateString('en-ZA')}
            
            examples###
            Przypomnij mi, że mam kupić mleko.
            {"tool":"ToDo","desc":"Kup mleko" }
            Jutro mam spotkanie z Marianem
            {"tool":"Calendar","desc":"Spotkanie z Marianem","date":"2024-04-18"}
        `
    ),
    new HumanMessage(`${task.question}`)
]);
console.log(result.content)

await aiDevsClient.sendAnswer(JSON.parse(result.content.toString()))