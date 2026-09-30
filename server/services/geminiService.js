const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-3.6-flash";


async function generate({
    contents,
    systemInstruction,
    tools
}) {

    const response =
        await ai.models.generateContent({

            model: MODEL,

            contents,

            config: {

                systemInstruction,

                tools

            }

        });


    return {

        provider: "gemini",

        model: MODEL,

        text:
            response.text || "",

        functionCalls:
            response.functionCalls || [],

        candidateContent:
            response.candidates?.[0]?.content || null,

        rawResponse:
            response

    };
}


module.exports = {
    generate
};