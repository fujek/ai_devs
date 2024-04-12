import {AiDevsClient} from "./ai_devs_client.ts";
import {OpenAIModerationChain} from "langchain/chains";

interface ModerationResult {
    flagged: boolean
}

interface ModerationOutput {
    results: ModerationResult[]
}

const aiDevsClient = await AiDevsClient.build("moderation");
const task = await aiDevsClient.getTaskMessage();
console.log(task)
const texts = task.input as string[]
const moderation = new OpenAIModerationChain();

const answer = await Promise.all(texts.map(async (t) => {
    const { results }  = await moderation.call({
        input: t,
    }) as ModerationOutput;
    if (results.length > 0) {
        return results[0].flagged ? 1 : 0
    }
    return 0;
}))

await aiDevsClient.sendAnswer(answer)

