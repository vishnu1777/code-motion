# DSA Algorithm Visualizer

An interactive Data Structures and Algorithms (DSA) visualizer that uses AI to analyze your code and generate step-by-step visualizations.

## Features

- 🤖 **AI-Powered Analysis**: Uses OpenAI GPT-4 to analyze your algorithm code
- 🔍 **Automatic Detection**: Detects data structures (stack, queue, array, linked list, tree, hash table)
- 📊 **Dynamic Visualization**: Real-time visualization of algorithm execution
- 🎯 **Step-by-Step Execution**: Navigate through each step of your algorithm
- 📝 **Educational Explanations**: Get detailed AI explanations of how your algorithm works
- 🎮 **Interactive Controls**: Play, pause, step forward/backward through execution

## Getting Started

### Prerequisites

- Node.js 18+ 
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your OpenAI API key:
   - Copy `.env.local.example` to `.env.local`
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_api_key_here
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Enter Your Algorithm**: Paste your algorithm code in the code editor
2. **Provide Input Data**: Enter the input data for your algorithm
3. **Analyze with AI**: Click "Analyze with AI" to let the system detect and analyze your algorithm
4. **Watch the Visualization**: Use the controls to step through or auto-play the visualization
5. **Learn**: Read the AI-generated explanation to understand how your algorithm works

## Supported Data Structures

- **Stack**: LIFO operations (push, pop)
- **Queue**: FIFO operations (enqueue, dequeue) 
- **Array**: Index-based operations and sorting
- **Linked List**: Node-based linear data structure
- **Tree**: Hierarchical data structure
- **Hash Table**: Key-value pair storage

## Example Algorithms

### Bubble Sort
```javascript
function bubbleSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    
    return arr;
}
```

### Stack Implementation
```javascript
function isValidParentheses(s) {
    const stack = [];
    const pairs = { '(': ')', '[': ']', '{': '}' };
    
    for (let char of s) {
        if (pairs[char]) {
            stack.push(char);
        } else {
            const last = stack.pop();
            if (pairs[last] !== char) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
}
```

## Technologies Used

- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **OpenAI API** - AI analysis
- **Lucide React** - Icons

## API Endpoints

### POST /api/analyze-algorithm

Analyzes algorithm code using OpenAI GPT-4.

**Request Body:**
```json
{
  "code": "function bubbleSort(arr) { ... }",
  "input": "[64, 34, 25, 12, 22, 11, 90]"
}
```

**Response:**
```json
{
  "algorithmType": "array",
  "explanation": "Detailed explanation...",
  "steps": [
    {
      "id": 0,
      "description": "Step description",
      "highlight": "Code being executed",
      "variables": { "i": 0, "j": 0 },
      "dataStructure": { "array": [64, 34, 25, 12, 22, 11, 90] }
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the maintainers.
