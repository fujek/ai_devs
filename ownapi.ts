import {AiDevsClient} from "./ai_devs_client.ts";
import {ChatOpenAI} from "@langchain/openai";
import {HumanMessage} from "langchain/schema";

interface QuestionRequest {
    question: string;
}

interface QuestionReply {
    reply: string;
}


const aiDevsClient = await AiDevsClient.build("ownapi");
const task = await aiDevsClient.getTaskMessage();
console.log(task)

const answer = async (question: string) => {
    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
    });
    const result = await model.invoke([
        new HumanMessage(`Odpowiedz na pytanie najkrócej jak potrafisz: ${question}`)
    ]);
    return result.content.toString()
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