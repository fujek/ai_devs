import {AiDevsClient} from "./ai_devs_client.ts";
import {OpenAI} from "@langchain/openai";
import {ConversationChain} from "langchain/chains";

const aiDevsClient = await AiDevsClient.build("scraper");
const task = await aiDevsClient.getTaskMessage();
console.log(task.msg)
console.log(task.input)
console.log(task.question)

async function readInputText() {
    try {
        const response = await fetch(task.input as string, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
            }
        });
        console.log(response.status)
        if (response.ok) {
            return response.text()
        }
        console.info('Executing again....')
        return readInputText()
    } catch (err) {
        console.error(err)
        console.info('Executing again....')
        return readInputText()
    }
}


const inputText = await readInputText();
console.log(inputText)

const chain = new ConversationChain({
    llm: new OpenAI({
        modelName: "gpt-3.5-turbo"
    }),
});
const {response: answer} = await chain.call({
    input: `
    ${task.msg}
    Question: ${task.question}
    Article:
    ${inputText}
    `
});
console.log(`Answer is ${answer}`)

await aiDevsClient.sendAnswer(answer)