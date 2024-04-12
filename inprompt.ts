import {AiDevsClient} from "./ai_devs_client.ts";
import {OpenAI} from "@langchain/openai";
import {ConversationChain} from "langchain/chains";

const aiDevsClient = await AiDevsClient.build("inprompt");
const task = await aiDevsClient.getTaskMessage();
console.log(task)

const chain = new ConversationChain({
    llm: new OpenAI({
        modelName: "gpt-3.5-turbo"
    })
});
const {response: name} = await chain.call({
    input: `Znajdź imię, które jest zawarte w zdaniu. Zdanie: "${task.question}?". Wyświetl to imię i NIC więcej - bez dodatkowych słów i kropki na końcu.`
});
console.log(name)
const filteredData = task.input?.filter(s => s.includes(name));
console.log(filteredData)
const {response: answer} = await chain.call({
    input: `
    Bazując na wiedzy:
    ${filteredData?.join("\n")}
    Odpowiedz na pytanie: ${task.question}
    `
});
console.log(answer)
await aiDevsClient.sendAnswer(answer)