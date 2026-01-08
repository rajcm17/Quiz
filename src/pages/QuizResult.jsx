import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { quizService } from '../services/quiz.service';

const QuizResult = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  const { score = 0, total = 0, answers = {}, quizTitle = '' } = location.state || {};

  useEffect(() => {
    const fetchQuiz = async () => {
      const result = await quizService.getQuizById(id);
      if (result.success) {
        setQuiz(result.quiz);
      }
      setLoading(false);
    };

    fetchQuiz();
  }, [id]);

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 80) return 'Excellent work!';
    if (percentage >= 60) return 'Good job!';
    return 'Keep practicing!';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
        <p className="mt-2 text-gray-600">{quiz?.title || quizTitle}</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Score Summary */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-indigo-100">
              <span className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
                {percentage}%
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              {score} / {total} Correct
            </h2>
            <p className="mt-2 text-lg text-gray-600">{getScoreMessage(percentage)}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate(`/take-quiz/${id}`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Retake Quiz
            </button>
          </div>

          {/* Detailed Results */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Results</h3>
            <div className="space-y-6">
              {quiz?.questions?.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div key={index} className={`border rounded-lg p-4 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="ml-3 flex-1">
                        <h4 className="text-base font-medium text-gray-900">
                          {index + 1}. {question.question}
                        </h4>
                        <div className="mt-2 space-y-2">
                          {question.options.map((option, optIndex) => {
                            let optionClass = 'p-2 rounded';

                            if (optIndex === question.correctAnswer) {
                              optionClass += ' bg-green-100 border border-green-300';
                            } else if (userAnswer === optIndex && !isCorrect) {
                              optionClass += ' bg-red-100 border border-red-300';
                            } else {
                              optionClass += ' bg-gray-100';
                            }

                            return (
                              <div key={optIndex} className={optionClass}>
                                <div className="flex items-center">
                                  <span className="mr-2 font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                                  <span>{option}</span>
                                  {optIndex === question.correctAnswer && (
                                    <span className="ml-2 text-green-600 font-medium">(Correct Answer)</span>
                                  )}
                                  {userAnswer === optIndex && userAnswer !== question.correctAnswer && (
                                    <span className="ml-2 text-red-600 font-medium">(Your Answer)</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;