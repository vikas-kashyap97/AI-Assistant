import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    let body;
    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON input" }, { status: 400 });
    }

    const { provider, userInput, aiResp } = body;
    if (!provider || !userInput) {
        return NextResponse.json({ error: "Missing provider or userInput" }, { status: 400 });
    }

    const headers = {
        Authorization: `Bearer ${process.env.EDEN_AI_API_KEY}`, // FIXED AUTHORIZATION HEADER
        "Content-Type": "application/json"
    };

    const url = "https://api.edenai.run/v2/multimodal/chat";
    const payload = {
        providers: [provider],
        messages: [
            {
                role: "user",
                content: [{ type: "text", content: { text: userInput } }]
            },
            ...(aiResp ? [{
                role: "assistant",
                content: [{ type: "text", content: { text: aiResp } }]
            }] : [])
        ]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ error: `Eden AI error: ${errorText}` }, { status: response.status });
        }

        const result = await response.json();
        console.log(result);

        // FIXED: Prevent undefined `generated_text` from breaking the UI
        const assistantResponse = result?.[provider]?.generated_text || "No response from AI.";

        return NextResponse.json({ role: "assistant", content: assistantResponse });
    } catch (error) {
        console.error("API request failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
