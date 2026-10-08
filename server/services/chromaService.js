const { ChromaClient } = require("chromadb");


// ==================================================
// Chroma Client
// ==================================================

const client =
    new ChromaClient({
        path: "http://localhost:8000"
    });


// ==================================================
// Collection
// ==================================================

const COLLECTION_NAME =
    "electroagent_knowledge";


// ==================================================
// Get Collection
// ==================================================

async function getCollection() {

    const collection =
        await client.getOrCreateCollection({

            name:
                COLLECTION_NAME

        });

    return collection;
}


// ==================================================
// Add Documents
// ==================================================

async function addDocuments(
    documents
) {

    const collection =
        await getCollection();


    if (
        !documents ||
        documents.length === 0
    ) {

        return;

    }


    const ids =
        documents.map(
            document =>
                String(document.id)
        );


    const texts =
        documents.map(
            document =>
                document.text
        );


    const embeddings =
        documents.map(
            document =>
                document.embedding
        );


    await collection.upsert({

        ids,

        documents:
            texts,

        embeddings

    });

}


// ==================================================
// Search
// ==================================================

async function searchDocuments(
    embedding,
    topK = 3
) {

    const collection =
        await getCollection();


    const result =
        await collection.query({

            queryEmbeddings: [
                embedding
            ],

            nResults:
                topK

        });


    const documents =
        result.documents?.[0] || [];


    const ids =
        result.ids?.[0] || [];


    const distances =
        result.distances?.[0] || [];


    return documents.map(
        (text, index) => ({

            id:
                ids[index],

            text:

                text,

            distance:
                distances[index]

        })
    );

}


module.exports = {

    getCollection,

    addDocuments,

    searchDocuments

};