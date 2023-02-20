import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { OpenAIApi, Configuration } from 'openai';

dotenv.config();
console.log(process.env.OPENAPI_KEY);
const configuration = new Configuration({
    apiKey: process.env.OPENAPI_KEY,
});

//instance of openai
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors()); //to make cross origin requests

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json()); //to get the json data from backend to frontend

//port
const port = 3000;

app.get('/', async(req, res) => {
    res.status(200).send({
        message: 'Hello from Anshul',
    })
})

app.post('/', async(req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`, //defined in client
            temperature: 0, //higher the temp value , higher the risks so reduce the by default temp 0.7 to 0
            max_tokens: 3000, //max number of characters it can generate
            top_p: 1,
            frequency_penalty: 0.5, //not going to repeat frequent sentences often
            presence_penalty: 0,

        });
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
    }

})
app.listen(`${port}` || 5000), () => {
    console.log(`Server running on port ${port}`)
};