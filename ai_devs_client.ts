interface TokenResponse {
    code: number,
    msg: string,
    token: string
}

interface TaskResponse {
    code: number;
    msg: string;
    answer?: string;
    question?: string;
    input?: string[] | string;
    [key: string]: unknown;
}
export class AiDevsClient {
    private readonly token;

    private constructor(token: string) {
        this.token = token;
        this.printToken();
    }

    static async build(taskName: string) {
        const token = await this.getToken(taskName);
        return new AiDevsClient(token);
    }

    private static async getToken(taskName: string) {
        try {
            const tokenFetchResponse = await fetch(`${process.env.AI_DEVS_TOKEN_URL}/${taskName}`, {
                method: 'POST',
                body: JSON.stringify({
                    apikey: process.env.AI_DEVS_API_KEY as string
                })
            });
            const tokenResponse = await tokenFetchResponse.json() as TokenResponse
            return tokenResponse.token;
        } catch (e) {
            console.error(e)
            throw e;
        }
    }

    public printToken() {
        console.log(`Token is ${this.token}`)
    }

    async getTaskMessage(): Promise<TaskResponse> {
        return new Promise(async (resolve) => {
            try {
                const taskFetchResponse = await fetch(`${process.env.AI_DEVS_TASK_URL}/${this.token}`);
                if (taskFetchResponse.status === 200) {
                    resolve(await taskFetchResponse.json() as TaskResponse);
                } else {
                    setTimeout(() => {
                        console.warn(`Status is ${taskFetchResponse.status}. Retrying...`)
                        resolve(this.getTaskMessage())
                    }, 10000)
                }
            } catch (e) {
                console.error(e)
                throw e;
            }
        })
    }

    async postQuestion(question: string) {
        try {
            const formData = new FormData();
            formData.append("question", question)
            const taskFetchResponse = await fetch(`${process.env.AI_DEVS_TASK_URL}/${this.token}`, {
                method: 'POST',
                body: formData
            });
            return await taskFetchResponse.json() as TaskResponse
        } catch (e) {
            console.error(e)
            throw e;
        }
    }

    async sendAnswer(answer: unknown) {
        try {
            const answerFetchResponse = await fetch(`${process.env.AI_DEVS_ANSWER_URL}/${this.token}`, {
                method: 'POST',
                body: JSON.stringify({
                    answer: answer
                })
            });
            console.log(await answerFetchResponse.json())
        } catch (e) {
            console.error(e)
            throw e;
        }
    }
}