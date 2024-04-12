import {AiDevsClient} from "./ai_devs_client.ts";
import {OpenAI} from "@langchain/openai";
import {ConversationChain} from "langchain/chains";

const aiDevsClient = await AiDevsClient.build("search");
const task = await aiDevsClient.getTaskMessage();
console.log(task)



