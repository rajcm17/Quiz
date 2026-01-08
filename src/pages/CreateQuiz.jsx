import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../services/quiz.service';
import { useAuth } from '../hooks/useAuth';
import { QUIZ_STATUS } from '../utils/constants';

const CreateQuiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    timeLimit: '',
    questions: []
  });
  
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      setError('Question cannot be empty');
      return;
    }
    
    if (currentQuestion.options.some(option => !option.trim())) {
      setError('All options must be filled');
      return;
    }
    
    const newQuestion = {
      ...currentQuestion,
      options: currentQuestion.options.filter(option => option.trim() !== '')
    };
    
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, newQuestion]
    });
    
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
    
    setError('');
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions.splice(index, 1);
    setQuizData({
      ...quizData,
      questions: updatedQuestions
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions
    });
  };

  const handleSave = async (status) => {
    if (!quizData.title.trim()) {
      setError('Quiz title is required');
      return;
    }
    
    if (quizData.questions.length === 0) {
      setError('At least one question is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await quizService.createQuiz({
      ...quizData,
      timeLimit: parseInt(quizData.timeLimit) || 0,
      status
    }, user.uid);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (!quizData.title.trim()) {
      setError('Quiz title is required');
      return;
    }
    
    if (quizData.questions.length === 0) {
      setError('At least one question is required');
      return;
    }
    
    // For preview, we'll just show the questions in an alert for now
    // In a real app, we'd navigate to a preview page
    alert(`Preview: ${quizData.questions.length} questions ready`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
        <p className="mt-2 text-gray-600">Build your quiz by adding questions and setting options.</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Quiz Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz Details</h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={quizData.title}
                    onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter quiz title"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={quizData.description}
                    onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter quiz description"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">
                  Time Limit (minutes)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="timeLimit"
                    id="timeLimit"
                    value={quizData.timeLimit}
                    onChange={(e) => setQuizData({ ...quizData, timeLimit: e.target.value })}
                    min="0"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="0 for no limit"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add Question Form */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Question</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                  Question
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="question"
                    id="question"
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter your question"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                {currentQuestion.options.map((option, index) => (
                  <div key={index}>
                    <label htmlFor={`option-${index}`} className="block text-sm font-medium text-gray-700">
                      Option {index + 1}
                    </label>
                    <div className="mt-1 flex">
                      <input
                        type="text"
                        name={`option-${index}`}
                        id={`option-${index}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder={`Option ${index + 1}`}
                      />
                      <div className="ml-2 flex items-center">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={currentQuestion.correctAnswer === index}
                          onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Question
                </button>
              </div>
            </div>
          </div>

          {/* Questions List */}
          {quizData.questions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions ({quizData.questions.length})</h2>
              <div className="space-y-4">
                {quizData.questions.map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{index + 1}. {question.question}</h3>
                        <div className="mt-2 space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center">
                              <input
                                type="radio"
                                disabled
                                checked={optIndex === question.correctAnswer}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                              />
                              <label className={`ml-2 block text-sm ${optIndex === question.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-700'}`}>
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="ml-4 inline-flex items-center p-2 border border-transparent rounded-full text-red-400 hover:text-red-500 focus:outline-none"
                      >
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handlePreview}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => handleSave(QUIZ_STATUS.DRAFT)}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave(QUIZ_STATUS.PUBLISHED)}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Publish Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;