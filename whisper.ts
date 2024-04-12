import {AiDevsClient} from "./ai_devs_client.ts";
import {OpenAIWhisperAudio} from "langchain/document_loaders/fs/openai_whisper_audio";

const aiDevsClient = await AiDevsClient.build("whisper");
const task = await aiDevsClient.getTaskMessage();
console.log(task)
const loader = new OpenAIWhisperAudio("./mateusz.mp3")
const docs = await loader.load();

if (docs.length > 0) {
    await aiDevsClient.sendAnswer(docs[0].pageContent)
}
console.log(docs);
