import {AiDevsClient} from "./ai_devs_client.ts";
import {ChatOpenAI} from "@langchain/openai";
import {BaseMessageChunk, HumanMessage} from "langchain/schema";

const aiDevsClient = await AiDevsClient.build("knowledge");
const task = await aiDevsClient.getTaskMessage();
console.log(task)

const tasksDefinition = {
    getExchangeRate: async ({currencyCode}: any) => {
        console.log('CurrencyCode', currencyCode)
        const response = await fetch('https://api.nbp.pl/api/exchangerates/tables/a?format=json');
        const data = await response.json() as any[];
        if (data.length > 0) {
            // @ts-ignore
            const mid = data[0].rates.find(c => c.code === currencyCode)?.mid;
            if (mid) {
                return mid
            }
        }
        throw new Error(`Unknown currency ${currencyCode}`)
    },
    getCountryPopulation: async ({countryName}: any) => {
        console.log(`https://restcountries.com/v3.1/name/${countryName}`)
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        const data = await response.json() as any[];
        console.log(data)
        if (data.length > 0) {
            return data[0].population;
        }
        throw new Error(`Unknown country ${countryName}`)
    },
    answerGeneralQuestion: async ({question}: any) => {
        const model = new ChatOpenAI({
            modelName: "gpt-3.5-turbo",
        });
        const result = await model.invoke([
            new HumanMessage(`Odpowiedz na pytanie najkrócej jak potrafisz: ${question}`)
        ]);
        return result.content
    }
}


const getExchangeRateSchema = {
    "name": "getExchangeRate",
    "description": "get exchange rate for given currency",
    "parameters": {
        "type": "object",
        "properties": {
            "currencyCode": {
                "type": "string",
                "description": "currency code"
            }
        }
    },
    "required": [
        "currencyCode"
    ]
}

const getCountryPopulationSchema = {
    "name": "getCountryPopulation",
    "description": "get country population by country name",
    "parameters": {
        "type": "object",
        "properties": {
            "countryName": {
                "type": "string",
                "description": "country name (english)"
            }
        }
    },
    "required": [
        "countryName"
    ]
}

const getGeneralQuestionSchema = {
    "name": "answerGeneralQuestion",
    "description": "answer general question",
    "parameters": {
        "type": "object",
        "properties": {
            "question": {
                "type": "string",
                "description": "general question"
            }
        }
    },
    "required": [
        "question"
    ]
}


const model = new ChatOpenAI({
    modelName: "gpt-4-0613",
}).bind({
    functions: [getCountryPopulationSchema, getExchangeRateSchema, getGeneralQuestionSchema],
});
const result = await model.invoke([
    new HumanMessage(task.question ?? "")
]);
const parseFunctionCall = (result: BaseMessageChunk): { name: string, args: any } | null => {
    if (result?.additional_kwargs?.function_call === undefined) {
        return null;
    }
    return {
        name: result.additional_kwargs.function_call.name,
        args: JSON.parse(result.additional_kwargs.function_call.arguments),
    }
}
const action = parseFunctionCall(result);
console.log('Action: ', action)
if (action && tasksDefinition.hasOwnProperty(action.name)) {
    const answer = await tasksDefinition[action.name as keyof typeof tasksDefinition](action.args);
    console.log(`ANSWER ${answer}`)
    await aiDevsClient.sendAnswer(answer)
} else {
    console.error('Unknown action!')
}
