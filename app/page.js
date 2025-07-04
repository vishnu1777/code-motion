'use client'
import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Code, Brain, Eye, Loader2 } from 'lucide-react';

const DSAVisualizer = () => {
  const [code, setCode] = useState(`function bubbleSort(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    
    return arr;
}`);

  const [input, setInput] = useState('[64, 34, 25, 12, 22, 11, 90]');
  const [algorithmType, setAlgorithmType] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [steps, setSteps] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const analyzeAlgorithm = async () => {
    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-algorithm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to analyze algorithm');
      }

      const data = await response.json();

      setAlgorithmType(data.algorithmType || 'other');
      setExplanation(data.explanation || 'No explanation available');
      setSteps(data.steps || []);
      setCurrentStep(0);
      setIsPlaying(false);

    } catch (err) {
      setError(`Failed to analyze algorithm: ${err.message}`);
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

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
    const dataStructure = currentStepData.dataStructure || {};

    switch (algorithmType) {
      case 'stack':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-lg font-semibold text-gray-700">Stack Visualization</div>
            <div className="flex flex-col-reverse space-y-reverse space-y-2 min-h-[200px] justify-end">
              {(dataStructure.stack || []).map((item, index) => (
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
              {(dataStructure.stack || []).length === 0 && (
                <div className="w-16 h-12 border-2 border-dashed border-gray-300 flex items-center justify-center rounded text-gray-400">
                  Empty
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Stack Size: {(dataStructure.stack || []).length}
            </div>
          </div>
        );

      case 'queue':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-lg font-semibold text-gray-700">Queue Visualization</div>
            <div className="flex space-x-2 min-w-[300px] justify-center">
              {(dataStructure.queue || []).map((item, index) => (
                <div
                  key={index}
                  className="w-12 h-12 bg-green-500 text-white flex items-center justify-center rounded font-bold shadow-lg"
                >
                  {item}
                </div>
              ))}
              {(dataStructure.queue || []).length === 0 && (
                <div className="w-12 h-12 border-2 border-dashed border-gray-300 flex items-center justify-center rounded text-gray-400">
                  Empty
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Queue Size: {(dataStructure.queue || []).length}
            </div>
          </div>
        );

      case 'array':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-lg font-semibold text-gray-700">Array Visualization</div>
            <div className="flex space-x-1">
              {(dataStructure.array || []).map((item, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 flex items-center justify-center rounded border-2 transition-all duration-300 ${index === dataStructure.currentIndex
                    ? 'bg-yellow-200 border-yellow-500 scale-110'
                    : 'bg-gray-100 border-gray-300'
                    }`}
                >
                  {item}
                </div>
              ))}
            </div>
            {dataStructure.currentIndex !== undefined && (
              <div className="text-sm text-gray-600">
                Current Index: {dataStructure.currentIndex}
              </div>
            )}
          </div>
        );

      case 'linkedlist':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-lg font-semibold text-gray-700">Linked List Visualization</div>
            <div className="flex items-center space-x-2">
              {(dataStructure.linkedlist || []).map((item, index) => (
                <React.Fragment key={index}>
                  <div className="w-12 h-12 bg-purple-500 text-white flex items-center justify-center rounded font-bold">
                    {item}
                  </div>
                  {index < (dataStructure.linkedlist || []).length - 1 && (
                    <div className="text-gray-400">→</div>
                  )}
                </React.Fragment>
              ))}
              {(dataStructure.linkedlist || []).length === 0 && (
                <div className="w-12 h-12 border-2 border-dashed border-gray-300 flex items-center justify-center rounded text-gray-400">
                  NULL
                </div>
              )}
            </div>
          </div>
        );

      case 'tree':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-lg font-semibold text-gray-700">Tree Visualization</div>
            <div className="text-sm text-gray-600">
              Tree visualization - {(dataStructure.tree || []).length} nodes
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(dataStructure.tree || []).map((item, index) => (
                <div key={index} className="w-10 h-10 bg-indigo-500 text-white flex items-center justify-center rounded">
                  {item}
                </div>
              ))}
            </div>
          </div>
        );

      case 'hash':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-lg font-semibold text-gray-700">Hash Table Visualization</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(dataStructure.hash || {}).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2 bg-orange-100 p-2 rounded">
                  <span className="font-mono text-orange-600">{key}:</span>
                  <span className="font-mono">{value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-lg font-semibold text-gray-700">
              {algorithmType ? `${algorithmType.toUpperCase()} Visualization` : 'Algorithm Visualization'}
            </div>
            <div className="text-center text-gray-500 p-8">
              {steps.length === 0 ? (
                <div>
                  <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Click "Analyze with AI" to visualize your algorithm</p>
                </div>
              ) : (
                <div>
                  <p>Visualization for {algorithmType} algorithm</p>
                  <div className="mt-4 text-sm">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  const renderVariables = () => {
    const vars = currentStepData.variables || {};
    if (Object.keys(vars).length === 0) return null;

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
                <button
                  onClick={analyzeAlgorithm}
                  disabled={isAnalyzing || !code.trim()}
                  className="mt-3 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      <span>Analyze with AI</span>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-red-800 font-semibold">Error</div>
                  <div className="text-red-600 text-sm mt-1">{error}</div>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-blue-700">AI Explanation</h2>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {explanation || "Click 'Analyze with AI' to get detailed explanation of your algorithm..."}
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
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {algorithmType ? `Detected: ${algorithmType.toUpperCase()}` : 'Algorithm not analyzed yet'}
              </div>
              {steps.length > 0 && (
                <div className="text-sm text-gray-500">
                  Total Steps: {steps.length}
                </div>
              )}
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