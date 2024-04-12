import {AiDevsClient} from "./ai_devs_client.ts";
import {OpenAI} from "@langchain/openai";
import {ConversationChain} from "langchain/chains";

async function getHint() {
    const aiDevsClient = await AiDevsClient.build("whoami");
    const task = await aiDevsClient.getTaskMessage();
    return task.hint as string;
}

const chain = new ConversationChain({
    llm: new OpenAI({
        modelName: "gpt-3.5-turbo"
    }),
});
const {response: answer} = await chain.call({
    input: `
    I'll send you some information in polish about a certain person.
    Answer who it is.
    If you're not 100% sure who it is, answer with "NO" only.
    If you're 100% sure who it is, answer only with the name of this person.
    Example:
    NO (if you don't know)
    or
    John Travolta (if you know)
    `
});

let name = "NO";
while (name === "NO") {
    const hint = await getHint();
    console.log(`Hint is ${hint}`)
    const {response} = await chain.call({
        input: hint
    });
    name = response;
    console.log(name)
}
const aiDevsClient = await AiDevsClient.build("whoami");
await aiDevsClient.sendAnswer(name)


