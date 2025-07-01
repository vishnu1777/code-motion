'use client'
import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Code, Brain, Eye } from 'lucide-react';

const DSAVisualizer = () => {
  const [code, setCode] = useState(`function twoSum(nums, target) {
    const stack = [];
    const result = [];
    
    for (let i = 0; i < nums.length; i++) {
        stack.push(nums[i]);
        
        if (stack.length >= 2) {
            const b = stack.pop();
            const a = stack.pop();
            
            if (a + b === target) {
                result.push([a, b]);
            } else {
                stack.push(a, b);
            }
        }
    }
    
    return result;
}`);

  const [input, setInput] = useState('[2, 7, 11, 15], target: 9');
  const [algorithmType, setAlgorithmType] = useState('stack');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [steps, setSteps] = useState([]);
  const [variables, setVariables] = useState({});

  // Sample algorithm detection and step generation
  const detectAlgorithm = (code) => {
    if (code.includes('stack') || code.includes('push') || code.includes('pop')) return 'stack';
    if (code.includes('queue') || code.includes('enqueue') || code.includes('dequeue')) return 'queue';
    if (code.includes('graph') || code.includes('dfs') || code.includes('bfs')) return 'graph';
    if (code.includes('sliding') || code.includes('window')) return 'sliding-window';
    if (code.includes('two') && code.includes('pointer')) return 'two-pointers';
    return 'array';
  };

  const generateSteps = () => {
    const type = detectAlgorithm(code);
    setAlgorithmType(type);

    // Mock step generation based on algorithm type
    if (type === 'stack') {
      setSteps([
        {
          id: 0,
          description: 'Initialize empty stack and result array',
          stack: [],
          variables: { i: 0, nums: [2, 7, 11, 15], target: 9, result: [] },
          highlight: 'const stack = []; const result = [];'
        },
        {
          id: 1,
          description: 'Start loop: i = 0, push nums[0] = 2 to stack',
          stack: [2],
          variables: { i: 0, nums: [2, 7, 11, 15], target: 9, result: [] },
          highlight: 'stack.push(nums[i]);'
        },
        {
          id: 2,
          description: 'Stack length < 2, continue to next iteration',
          stack: [2],
          variables: { i: 1, nums: [2, 7, 11, 15], target: 9, result: [] },
          highlight: 'if (stack.length >= 2)'
        },
        {
          id: 3,
          description: 'i = 1, push nums[1] = 7 to stack',
          stack: [2, 7],
          variables: { i: 1, nums: [2, 7, 11, 15], target: 9, result: [] },
          highlight: 'stack.push(nums[i]);'
        },
        {
          id: 4,
          description: 'Stack length >= 2, pop b = 7, then a = 2',
          stack: [],
          variables: { i: 1, nums: [2, 7, 11, 15], target: 9, result: [], a: 2, b: 7 },
          highlight: 'const b = stack.pop(); const a = stack.pop();'
        },
        {
          id: 5,
          description: 'Check: a + b = 2 + 7 = 9 === target (9) ✓',
          stack: [],
          variables: { i: 1, nums: [2, 7, 11, 15], target: 9, result: [[2, 7]], a: 2, b: 7 },
          highlight: 'if (a + b === target)'
        }
      ]);
    }

    setExplanation(`Detected Algorithm: ${type.toUpperCase()}\n\nThis algorithm uses a stack data structure to solve the two-sum problem. It processes elements one by one, maintaining a stack of potential candidates and checking pairs when the stack has at least 2 elements.`);
  };

  useEffect(() => {
    generateSteps();
  }, [code]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const currentStepData = steps[currentStep] || {};

  const renderVisualization = () => {
    switch (algorithmType) {
      case 'stack':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-lg font-semibold text-gray-700">Stack Visualization</div>
            <div className="flex flex-col-reverse space-y-reverse space-y-2 min-h-[200px] justify-end">
              {(currentStepData.stack || []).map((item, index) => (
                <div
                  key={index}
                  className="w-16 h-12 bg-blue-500 text-white flex items-center justify-center rounded font-bold shadow-lg transform transition-all duration-500 hover:scale-105"
                  style={{
                    animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {item}
                </div>
              ))}
              {(currentStepData.stack || []).length === 0 && (
                <div className="w-16 h-12 border-2 border-dashed border-gray-300 flex items-center justify-center rounded text-gray-400">
                  Empty
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Stack Size: {(currentStepData.stack || []).length}
            </div>
          </div>
        );

      case 'queue':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-lg font-semibold text-gray-700">Queue Visualization</div>
            <div className="flex space-x-2 min-w-[300px] justify-center">
              {(currentStepData.queue || []).map((item, index) => (
                <div key={index} className="w-12 h-12 bg-green-500 text-white flex items-center justify-center rounded">
                  {item}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-lg font-semibold text-gray-700">Array Visualization</div>
            <div className="flex space-x-1">
              {(currentStepData.variables?.nums || []).map((item, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 flex items-center justify-center rounded border-2 ${index === currentStepData.variables?.i ? 'bg-yellow-200 border-yellow-500' : 'bg-gray-100 border-gray-300'
                    }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  const renderVariables = () => {
    const vars = currentStepData.variables || {};
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Variables</h3>
        <div className="space-y-1 text-sm">
          {Object.entries(vars).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-mono text-blue-600">{key}:</span>
              <span className="font-mono">{JSON.stringify(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br text-black from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <Brain className="w-8 h-8" />
              <span>DSA Algorithm Visualizer</span>
            </h1>
            <p className="mt-2 opacity-90">Understand algorithms through interactive visualization</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left Panel - Code Input */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Code className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-700">Algorithm Code</h2>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-64 p-3 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter your algorithm code here..."
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Input Data</h2>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter input data..."
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-blue-700">AI Explanation</h2>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {explanation || "Click 'Analyze' to get AI explanation..."}
                </div>
              </div>
            </div>

            {/* Right Panel - Visualization */}
            <div className="space-y-4">
              {/* Controls */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-700">Visualization</h2>
                  </div>
                  <div className="text-sm text-gray-600">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    disabled={currentStep === 0}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    disabled={currentStep === 0}
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    disabled={steps.length === 0}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    disabled={currentStep >= steps.length - 1}
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Main Visualization Area */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                {renderVisualization()}
              </div>

              {/* Step Description */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Current Step</h3>
                <p className="text-yellow-700 text-sm">
                  {currentStepData.description || "No step selected"}
                </p>
                {currentStepData.highlight && (
                  <div className="mt-2 p-2 bg-yellow-100 rounded font-mono text-xs text-yellow-800">
                    {currentStepData.highlight}
                  </div>
                )}
              </div>

              {/* Variables Panel */}
              {currentStepData.variables && renderVariables()}
            </div>
          </div>

          {/* Algorithm Type Badge */}
          <div className="px-6 pb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Detected: {algorithmType.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DSAVisualizer;