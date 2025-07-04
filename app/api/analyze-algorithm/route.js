// Helper function to detect algorithm type from code
function detectAlgorithmType(code) {
    const lowerCode = code.toLowerCase();
    if (lowerCode.includes('stack') || lowerCode.includes('push') || lowerCode.includes('pop')) return 'stack';
    if (lowerCode.includes('queue') || lowerCode.includes('enqueue') || lowerCode.includes('dequeue')) return 'queue';
    if (lowerCode.includes('sort') || lowerCode.includes('bubble') || lowerCode.includes('merge') || lowerCode.includes('quick')) return 'array';
    if (lowerCode.includes('tree') || lowerCode.includes('node') || lowerCode.includes('left') || lowerCode.includes('right')) return 'tree';
    if (lowerCode.includes('graph') || lowerCode.includes('dfs') || lowerCode.includes('bfs')) return 'graph';
    if (lowerCode.includes('hash') || lowerCode.includes('map') || lowerCode.includes('key')) return 'hash';
    if (lowerCode.includes('linkedlist') || lowerCode.includes('next')) return 'linkedlist';
    return 'array';
}

// Helper function to generate simple steps
function generateSimpleSteps(code, input, algorithmType) {
    try {
        const inputArray = JSON.parse(input);
        return [
            {
                id: 0,
                description: "Algorithm execution started",
                highlight: "function started",
                variables: { input: inputArray },
                dataStructure: { [algorithmType]: algorithmType === 'array' ? inputArray : [] }
            },
            {
                id: 1,
                description: "Processing algorithm logic",
                highlight: "main algorithm body",
                variables: { input: inputArray },
                dataStructure: { [algorithmType]: algorithmType === 'array' ? inputArray : [] }
            },
            {
                id: 2,
                description: "Algorithm execution completed",
                highlight: "return statement",
                variables: { input: inputArray },
                dataStructure: { [algorithmType]: algorithmType === 'array' ? inputArray : [] }
            }
        ];
    } catch (e) {
        return [
            {
                id: 0,
                description: "Algorithm analysis completed",
                highlight: "Unable to generate detailed steps",
                variables: {},
                dataStructure: { [algorithmType]: [] }
            }
        ];
    }
}

export async function POST(request) {
    try {
        const { code, input } = await request.json();

        const prompt = `Analyze this algorithm and provide a COMPLETE JSON response. IMPORTANT: Make sure the JSON is complete and properly terminated.

Required JSON structure:
{
  "algorithmType": "array",
  "explanation": "Brief explanation of the algorithm",
  "steps": [
    {
      "id": 0,
      "description": "Step description",
      "highlight": "code line",
      "variables": {"i": 0, "j": 0},
      "dataStructure": {"array": [64, 34, 25], "currentIndex": 0}
    }
  ]
}

Requirements:
1. Detect primary data structure (array, stack, queue, etc.)
2. Generate maximum 5 steps only
3. Keep explanations brief (under 100 words)
4. Return ONLY valid, complete JSON
5. No markdown, no code blocks, no extra text

Code: ${code}
Input: ${input}

RETURN COMPLETE JSON ONLY:`;

        // Call your internal API
        const response = await fetch(process.env.INTERNAL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: process.env.INTERNAL_API_USERNAME,
                password: process.env.INTERNAL_API_PASSWORD,
                api: parseInt(process.env.INTERNAL_API_ID),
                request: {
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful assistant that analyzes algorithms and provides step-by-step execution traces with data structure visualizations. Always return complete, valid JSON responses."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.3
                },
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error: ${response.status} - ${errorText}`);
            throw new Error(`Internal API error: ${response.status}`);
        }

        const apiData = await response.json();
        console.log('Full API Response:', JSON.stringify(apiData, null, 2));

        let analysisData;
        try {
            // Handle the response from your internal API
            // The response has a nested structure with openAIResponse
            let choices;
            if (apiData.response?.openAIResponse && apiData.response?.openAIResponse.choices) {
                choices = apiData.response?.openAIResponse?.choices;
            } else if (apiData.response.choices) {
                choices = apiData.response.choices;
            } else {
                throw new Error('No choices found in API response');
            }

            if (choices && choices[0] && choices[0].message && choices[0].message.content) {
                let content = choices[0].message.content.trim();
                console.log('AI Response Content:', content);

                // Clean up the content - remove markdown formatting if present
                if (content.startsWith('```json')) {
                    content = content.replace(/```json\s*/, '').replace(/```\s*$/, '');
                }
                if (content.startsWith('```')) {
                    content = content.replace(/```\s*/, '').replace(/```\s*$/, '');
                }

                // Try to fix incomplete JSON by adding missing closing braces
                if (!content.endsWith('}')) {
                    // Count opening and closing braces
                    const openBraces = (content.match(/\{/g) || []).length;
                    const closeBraces = (content.match(/\}/g) || []).length;
                    const missingBraces = openBraces - closeBraces;

                    if (missingBraces > 0) {
                        content += '}'.repeat(missingBraces);
                        console.log('Fixed incomplete JSON by adding closing braces');
                    }
                }

                // Try to parse as JSON
                analysisData = JSON.parse(content);

                // Validate the structure
                if (!analysisData.algorithmType) {
                    analysisData.algorithmType = 'other';
                }
                if (!analysisData.explanation) {
                    analysisData.explanation = 'Algorithm analysis completed';
                }
                if (!analysisData.steps || !Array.isArray(analysisData.steps)) {
                    analysisData.steps = [];
                }

            } else {
                throw new Error('Unexpected API response format');
            }
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);

            // Try to extract content even if JSON parsing fails
            let content = '';
            if (apiData.response?.openAIResponse?.choices?.[0]?.message?.content) {
                content = apiData.response.openAIResponse.choices[0].message.content;
            } else if (apiData.response?.choices?.[0]?.message?.content) {
                content = apiData.response.choices[0].message.content;
            }

            // Create a simple fallback response based on the code
            const detectedType = detectAlgorithmType(code);

            // Fallback response
            analysisData = {
                algorithmType: detectedType,
                explanation: content || `This appears to be a ${detectedType} algorithm. Unable to provide detailed analysis due to response parsing error.`,
                steps: generateSimpleSteps(code, input, detectedType)
            };
        }

        return Response.json(analysisData);
    } catch (error) {
        console.error('Error analyzing algorithm:', error);
        return Response.json(
            {
                error: 'Failed to analyze algorithm',
                details: error.message
            },
            { status: 500 }
        );
    }
}
