const llamaTools =
    require("../tools/llamaTools");


const OLLAMA_URL =
    "http://localhost:11434/api/chat";


const MODEL =
    "llama3.2";


async function generate({
    contents,
    systemInstruction
}) {

    const messages = [];


    // -----------------------------
    // System message
    // -----------------------------

    if (systemInstruction) {

        messages.push({

            role: "system",

            content:
                systemInstruction

        });

    }


    // -----------------------------
    // Convert messages
    // -----------------------------

    for (const content of contents) {

        if (!content.parts) {
            continue;
        }


        let text = "";


        for (const part of content.parts) {

            if (part.text) {

                text += part.text;

            }

        }


        if (text) {

            messages.push({

                role:
                    content.role === "model"
                        ? "assistant"
                        : content.role,

                content:
                    text

            });

        }

    }


    console.log(
        "Sending request to Ollama..."
    );


    const response =
        await fetch(
            OLLAMA_URL,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    model: MODEL,

                    messages,

                    tools:
                        llamaTools,

                    stream: false

                })

            }
        );


    if (!response.ok) {

        throw new Error(
            `Ollama error: ${response.status}`
        );

    }


    const data =
        await response.json();


    console.log(
        "OLLAMA RESPONSE:",
        JSON.stringify(
            data,
            null,
            2
        )
    );


    const message =
        data.message || {};


    return {

        provider: "llama",

        model: MODEL,

        text:
            message.content || "",

        functionCalls:
            message.tool_calls || [],

        rawResponse:
            data

    };

}


module.exports = {
    generate
};