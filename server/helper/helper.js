function normalizeFunctionCall(functionCall) {

    // Gemini

    if (
        functionCall.name &&
        functionCall.args
    ) {

        return {

            name:
                functionCall.name,

            args:
                functionCall.args

        };

    }


    // Ollama

    if (
        functionCall.function
    ) {

        return {

            name:
                functionCall.function.name,

            args:
                functionCall.function.arguments || {}

        };

    }


    return null;
}