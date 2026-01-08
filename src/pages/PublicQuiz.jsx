import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quiz.service';

const PublicQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const result = await quizService.getQuizById(id);
      if (result.success && result.quiz.status === 'published') {
        setQuiz(result.quiz);
        setTimeLeft(result.quiz.timeLimit * 60); // Convert minutes to seconds
      } else {
        alert('Quiz not found or not published');
        navigate('/');
      }
      setLoading(false);
    };

    fetchQuiz();
  }, [id, navigate]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && quiz && !quizCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz && !quizCompleted) {
      // Time's up, submit automatically
      handleSubmitQuiz();
    }
  }, [timeLeft, quiz, quizCompleted]);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setQuizCompleted(true);
    // Calculate score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });
    
    // Navigate to results page with score
    navigate(`/quiz-result/${id}`, { 
      state: { 
        score, 
        total: quiz.questions.length,
        answers,
        quizTitle: quiz.title
      } 
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">Quiz not found</h3>
          <p className="mt-1 text-sm text-gray-500">The quiz you're looking for doesn't exist or is not published.</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Quiz submitted!</h3>
          <p className="mt-1 text-sm text-gray-500">Your answers have been recorded.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            {quiz.timeLimit > 0 && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                timeLeft < 60 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                Time: {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-gray-600">{quiz.description}</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </h2>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div 
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAnswer === index 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswerSelect(currentQuestionIndex, index)}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      checked={selectedAnswer === index}
                      onChange={() => handleAnswerSelect(currentQuestionIndex, index)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-700">
                      {option}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Previous
            </button>
            
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNextQuestion}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicQuiz;