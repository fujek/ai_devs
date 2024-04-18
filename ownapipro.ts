import {AiDevsClient} from "./ai_devs_client.ts";
import {OpenAI} from "@langchain/openai";
import {ConversationChain} from "langchain/chains";

interface QuestionRequest {
    question: string;
}

const aiDevsClient = await AiDevsClient.build("ownapipro");
const task = await aiDevsClient.getTaskMessage();
console.log(task)

const chain = new ConversationChain({
    llm: new OpenAI({
        modelName: "gpt-3.5-turbo"
    })
});

const answer = async (question: string) => {
    const {response: answerAsString} = await chain.call({
        input: question
    });
    return answerAsString
}


Bun.serve({
    async fetch(req) {
        console.log(req)
        if (req.url.endsWith('/api') && req.method === 'POST') {
            const {question} = await req.json() as QuestionRequest;
            console.log(question)
            const reply = await answer(question)
            return Response.json({reply})
        }
        return Response.error();
    },
});

await aiDevsClient.sendAnswer('https://403a-78-10-207-208.ngrok-free.app/api')