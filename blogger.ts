import {AiDevsClient} from "./ai_devs_client.ts";
import {ChatOpenAI, OpenAI} from "@langchain/openai";
import {ConversationChain} from "langchain/chains";

const aiDevsClient = await AiDevsClient.build("blogger");
const task = await aiDevsClient.getTaskMessage();
console.log(task)

const chain = new ConversationChain({
    llm: new OpenAI({
        modelName: "gpt-3.5-turbo"
    })
});
const {response: answerAsString} = await chain.call({
    input: `
    I'd like to prepare article about pizza Margherita. 
    In the JavaScript array ${JSON.stringify(task.blog)} you can find headers for specific paragraphs.
    For each array's element please prepare a short content, ex. for 'pizza's history' describe from where pizza is.
    Your answer is only (so don't add anything more) the JavaScript array with the same elements number like the input array (headers). 
    Do not add header to the content and keep ordering.
    Answer in polish.
    `
});
console.log(answerAsString)
console.log(typeof answerAsString)
const answer = JSON.parse(answerAsString)
console.log(answer)
await aiDevsClient.sendAnswer(answer)