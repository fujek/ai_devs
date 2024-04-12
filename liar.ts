import {AiDevsClient} from "./ai_devs_client.ts";
import {ChatOpenAI, OpenAI} from "@langchain/openai";
import {ConversationChain} from "langchain/chains";

const aiDevsClient = await AiDevsClient.build("liar");
const task = await aiDevsClient.getTaskMessage();
console.log(task)

const response = await aiDevsClient.postQuestion('What is capital of Poland? Answer with a single word.');
console.log(response)

await aiDevsClient.sendAnswer(response.answer === 'Warsaw' ? "YES" : "NO")