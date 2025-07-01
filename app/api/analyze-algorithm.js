import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    const { code, input } = req.body;

    const prompt = `Analyze this algorithm and provide:
1. Algorithm type (stack, queue, graph, etc.)
2. Step-by-step execution trace
3. Educational explanation

Code: ${code}
Input: ${input}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
    });

    res.json({ analysis: response.choices[0].message.content });
}