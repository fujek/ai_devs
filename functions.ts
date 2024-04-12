import {AiDevsClient} from "./ai_devs_client.ts";
import {ChatOpenAI, OpenAI} from "@langchain/openai";
import {ConversationChain} from "langchain/chains";
import { HumanMessage } from "langchain/schema";

const aiDevsClient = await AiDevsClient.build("functions");
const task = await aiDevsClient.getTaskMessage();
console.log(task)

const addUserSchema = {
    "name": "addUser",
    "description": "add a user based on data",
    "parameters": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "provide name of the user"
            },
            "surname": {
                "type": "string",
                "description": "provide surname of the user"
            },
            "year": {
                "type": "integer",
                "description": "provide year of birth of the user"
            }
        }
    },
        "required": [
            "name", "surname", "year"
        ]
}

await aiDevsClient.sendAnswer(addUserSchema)
// const model = new ChatOpenAI({
//     modelName: "gpt-4-0613",
// }).bind({
//     functions: [addUserSchema],
//     function_call: {name: "addUser"},
// });
// const result = await model.invoke([
//     new HumanMessage("Hey there! My name is Jan Kowalski. My birthdate is 04.01.1973")
// ]);
// console.log(result.additional_kwargs.function_call)
