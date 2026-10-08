const {
    GoogleGenAI
} = require("@google/genai");


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


const EMBEDDING_MODEL =
    "gemini-embedding-001";


async function createEmbedding(text) {

    const response =
        await ai.models.embedContent({

            model: EMBEDDING_MODEL,

            contents: text,

            config: {
                taskType:
                    "RETRIEVAL_DOCUMENT"
            }

        });


    return response.embeddings[0].values;
}


async function createQueryEmbedding(text) {

    const response =
        await ai.models.embedContent({

            model: EMBEDDING_MODEL,

            contents: text,

            config: {
                taskType:
                    "RETRIEVAL_QUERY"
            }

        });


    return response.embeddings[0].values;
}


module.exports = {
    createEmbedding,
    createQueryEmbedding
};