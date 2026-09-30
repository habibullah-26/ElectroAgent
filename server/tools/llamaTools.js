const toolDefinitions =
    require("./toolDefinitions");


const llamaTools =
    toolDefinitions.map(tool => ({

        type: "function",

        function: {

            name:
                tool.name,

            description:
                tool.description,

            parameters:
                tool.parameters

        }

    }));


module.exports = llamaTools;