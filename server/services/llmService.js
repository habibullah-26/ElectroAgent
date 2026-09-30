const geminiService =
    require("./geminiService");

const llamaService =
    require("./llamaService");


const provider =
    (process.env.AI_PROVIDER || "gemini")
        .toLowerCase();


async function generate(options) {

    switch (provider) {

        case "gemini":

            return await geminiService.generate(
                options
            );


        case "llama":

            return await llamaService.generate(
                options
            );


        default:

            throw new Error(
                `Unsupported AI provider: ${provider}`
            );
    }
}


function getProvider() {

    return provider;
}


module.exports = {

    generate,

    getProvider

};