import {AiDevsClient} from "./ai_devs_client.ts";
import {OpenAI, OpenAIEmbeddings} from "@langchain/openai";
import {ConversationChain} from "langchain/chains";

const aiDevsClient = await AiDevsClient.build("embedding");
const task = await aiDevsClient.getTaskMessage();
console.log(task)

const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002"
});
const result = await embeddings.embedQuery(`Hawaiian pizza`);
console.log(result)
await aiDevsClient.sendAnswer(result)