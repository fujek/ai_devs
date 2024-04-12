import {AiDevsClient} from "./ai_devs_client.ts";

const aiDevsClient = await AiDevsClient.build("helloapi");
const task = await aiDevsClient.getTaskMessage();
await aiDevsClient.sendAnswer(task['cookie'])

