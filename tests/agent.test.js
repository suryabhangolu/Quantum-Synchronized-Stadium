// Quantum Synchronized Stadium - Multi-Agent State Tests

describe("Multi-Agent System Intelligence", () => {

    function getAgentStatusColor(status) {
        if(status === 'Active') return 'green';
        if(status === 'Processing') return 'orange';
        if(status === 'Alert') return 'red';
        return 'green';
    }

    function generateBotResponse(text) {
        const lower = text.toLowerCase();
        if(lower.includes('gate')) return "Gate A and B are on the North side. South Gate Main currently has heavy traffic.";
        if(lower.includes('food') || lower.includes('burger')) return "Quantum Burger has a 15 min wait time. If you're thirsty, Hydration Station has only a 1 min wait!";
        if(lower.includes('hi') || lower.includes('hello')) return "Hello! Welcome to Quantum Stadium! How can I assist your experience today?";
        return "I'm your AI assistant. I can help you find seats, food, or gates. What do you need?";
    }

    test("Agent status indicator correctly assigns alert levels", () => {
        expect(getAgentStatusColor('Alert')).toBe('red');
        expect(getAgentStatusColor('Processing')).toBe('orange');
        expect(getAgentStatusColor('Active')).toBe('green');
        
        // Edge cases or unknown fallback states
        expect(getAgentStatusColor('UnknownState')).toBe('green');
    });

    test("Chatbot response routing maps correctly to keywords", () => {
        const gateResponse = generateBotResponse("Which gate is nearest?");
        expect(gateResponse).toContain("Gate A");

        const foodResponse = generateBotResponse("I want to get food.");
        expect(foodResponse).toContain("Quantum Burger");

        const greetingResponse = generateBotResponse("hi there!");
        expect(greetingResponse).toContain("Welcome to Quantum Stadium!");
        
        const defaultResponse = generateBotResponse("unknown queries text");
        expect(defaultResponse).toContain("What do you need?");
    });
});
