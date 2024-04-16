import {AiDevsClient} from "./ai_devs_client.ts";
import {ChatOpenAI} from "@langchain/openai";

interface Person {
    imie: string;
    nazwisko: string;
    wiek: number;
    o_mnie: string;
    ulubiona_postac_z_kapitana_bomby: string;
    ulubiony_serial: string;
    ulubiony_film: string;
    ulubiony_kolor: string;
}

interface QuestionAnalysisResponse {
    imie: string;
    nazwisko: string;
    pytanie: "ulubiona_postac_z_kapitana_bomby" | "ulubiony_serial" | "ulubiony_film" | "ulubiony_kolor" | "inne"
}

const aiDevsClient = await AiDevsClient.build("people");
const task = await aiDevsClient.getTaskMessage();
console.log(task)

const peopleResponse = await fetch('https://tasks.aidevs.pl/data/people.json');
const people = await peopleResponse.json() as Person[];
console.log(people)

const chatModel = new ChatOpenAI({});
const {content} = await chatModel.invoke(`
       Na podstawie zadanego pytania zwróć informację w formacie JSON jakiej osoby ono dotyczy.
       Zwróć imię w oryginalnej postaci, nie używaj zdrobnień.
       Nie zwracaj nic więcej poza JSONem.
       Dodatkowo oznacz czy pytanie dotyczy filmu, serialu czy koloru.
       Jeśli nie znasz odpowiedzi, zwróć pusty obiekt JSON i nic więcej.
       ###
       Przykład:
       pytanie: Gdzie mieszka Tomek Ludek?
       odpowiedź:
       {
        "imie": "Tomasz",
        "nazwisko": "Ludek",
        "pytanie": "inne" ("ulubiona_postac_z_kapitana_bomby"|"ulubiony_serial"|"ulubiony_film"|"ulubiony_kolor"|"inne")
       }
       ###
       Moje pytanie: ${task.question}
       Pamiętaj! Nie używaj zdrobnień!
`);
console.log('Question analysis response', content)
const questionAnalysisResponse = JSON.parse(content.toString()) as QuestionAnalysisResponse;


const person = people.find(p => p.imie === questionAnalysisResponse.imie && p.nazwisko === questionAnalysisResponse.nazwisko);
console.log('Found person', person)
if (person) {
    if (questionAnalysisResponse.pytanie === 'inne') {
        const {content} = await chatModel.invoke(`
               Odpowiedz na pytanie najprościej i najkrócej jak potrafisz.
               Pytanie:
               ${task.question}
               ###
               Kontekst:
               ${person.o_mnie}
               ###
               Przykład:
               Pytanie: Gdzie mieszka Tomek Bzik?
               Wrocław
                `
        );
        console.log(`Answer is [LLM]: ${content}`)
        await aiDevsClient.sendAnswer(content.toString());
    } else {
        const answer = person[questionAnalysisResponse.pytanie];
        console.log(`Answer is: ${answer}.`)
        await aiDevsClient.sendAnswer(answer);
    }
} else {
    console.error('Cannot found such person :(')
}