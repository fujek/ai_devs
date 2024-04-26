import {AiDevsClient} from "./ai_devs_client.ts";
import {ChatOpenAI} from "@langchain/openai";
import {HumanMessage, SystemMessage} from "langchain/schema";

interface DataResponse {
    [key: string]: string[];
}

const aiDevsClient = await AiDevsClient.build("optimaldb");
const task = await aiDevsClient.getTaskMessage();
console.log(task)

const dataResponse = await (await fetch(task.database as string)).json() as DataResponse;
console.log(dataResponse)


const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
});
const result = await model.invoke([
    new SystemMessage(`
In this exercise, you are required to reduce the size of a given JSON which contains details for various people (person_name_1, person_name_2, etc.). 
Each person's details are encapsulated as an array of strings. 
Your task is to condense each of these string elements. 

Here's an example to illustrate the task. The original entry looks like this: 

{
 "John": ["Na ostatniej konferencji technologicznej, program Johna zdobył nagrodę za innowacyjne wykorzystanie JavaScript."]
}

You should reduce the sentence without losing essential information, like in this example:

{
 "John": ["Na konferencji jego program zdobył nagrodę za innowacyjne użycie JavaScript."]
}

Make sure that the logic of the sentences is kept intact even after condensing. 
Also ensure that the translated sentences adhere to proper grammatical standards. 
Remember that the goal is to achieve brevity without compromising on clarity. Good luck!
    `
    ),
    new HumanMessage(`${JSON.stringify(dataResponse)}`)
]);
const content = result.content;
console.log(content)
console.log(new Blob([content as string]).size)

// console.log(new Blob([""]).size)
// console.log(new Blob(["ą"]).size)
// console.log(new Blob(["ąą"]).size)
// console.log(new Blob(["ą "]).size)


await aiDevsClient.sendAnswer(content)