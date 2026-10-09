const fs = require("fs");
const path = require("path");


const {
    createEmbedding,
    createQueryEmbedding
} = require("./embeddingService");


const {
    addDocuments,
    searchDocuments
} = require("./chromaService");


// ==================================================
// Load Document
// ==================================================

function loadDocument() {

    const filePath =
        path.join(
            __dirname,
            "../documents/electro-store.txt"
        );


    if (
        !fs.existsSync(filePath)
    ) {

        throw new Error(
            `Document not found: ${filePath}`
        );

    }


    return fs.readFileSync(
        filePath,
        "utf8"
    );

}


// ==================================================
// Chunk Document
// ==================================================

function chunkText(
    text,
    chunkSize = 100
) {

    const words =
        text.split(/\s+/);


    const chunks = [];


    for (
        let i = 0;
        i < words.length;
        i += chunkSize
    ) {

        const chunk =
            words
                .slice(
                    i,
                    i + chunkSize
                )
                .join(" ");


        if (
            chunk.trim()
        ) {

            chunks.push(
                chunk.trim()
            );

        }

    }


    return chunks;

}


// ==================================================
// Initialize Knowledge Base
// ==================================================

async function initializeKnowledge() {

    console.log(
        "\n================================="
    );

    console.log(
        "Initializing RAG Knowledge Base"
    );

    console.log(
        "================================="
    );


    const document =
        loadDocument();


    if (
        !document.trim()
    ) {

        throw new Error(
            "document.txt is empty."
        );

    }


    const chunks =
        chunkText(
            document
        );


    console.log(
        `Document chunks: ${chunks.length}`
    );


    const documents = [];


    for (
        let i = 0;
        i < chunks.length;
        i++
    ) {

        console.log(
            `Creating embedding ${i + 1}/${chunks.length}`
        );


        const embedding =
            await createEmbedding(
                chunks[i]
            );


        documents.push({

            id:
                i + 1,

            text:
                chunks[i],

            embedding:
                embedding

        });

    }


    await addDocuments(
        documents
    );


    console.log(
        `Stored ${documents.length} documents in ChromaDB.`
    );


    console.log(
        "=================================\n"
    );

}


// ==================================================
// Search Knowledge
// ==================================================

// async function searchKnowledge(
//     query,
//     topK = 3
// ) {

//     const queryEmbedding =
//         await createQueryEmbedding(
//             query
//         );


//     const results =
//         await searchDocuments(
//             queryEmbedding,
//             topK
//         );


//     return results.map(
//         result => ({

//             id:
//                 result.id,

//             text:
//                 result.text,

//             score:
//                 1 -
//                 (result.distance || 0)

//         })
//     );

// }

async function searchKnowledge(
    query,
    topK = 3
) {
    if (
        !query ||
        typeof query !== "string" ||
        !query.trim()
    ) {
        throw new Error(
            "A valid search query is required."
        );
    }

    const queryEmbedding =
        await createQueryEmbedding(
            query.trim()
        );

    const results =
        await searchDocuments(
            queryEmbedding,
            topK
        );

    return results
        .filter(result =>
            typeof result.distance === "number"
        )
        .map(result => ({
            id: result.id,
            text: result.text,
            distance: result.distance
        }));
}


module.exports = {

    initializeKnowledge,

    searchKnowledge

};