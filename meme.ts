import {AiDevsClient} from "./ai_devs_client.ts";

interface RenderResponse {
    href: string
}

const aiDevsClient = await AiDevsClient.build("meme");
const task = await aiDevsClient.getTaskMessage();
console.log(task)


const {href} = await ((await fetch(`${process.env.RENDER_FORM_URL}`, {
    method: 'POST',
    headers:  {
        "X-API-KEY": `${process.env.RENDER_FORM_IO_API_KEY}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "template": "grumpy-pigs-charge-loudly-1297",
        "data": {
            "text.text": task.text,
            "image.src": "https://tasks.aidevs.pl/data/monkey.png"
        }
    })
})).json()) as RenderResponse;
console.log(href)


await aiDevsClient.sendAnswer(href)