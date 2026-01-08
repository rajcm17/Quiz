import React, { useState, useEffect } from 'react';
import { quizService } from '../services/quiz.service';
import { useAuth } from '../hooks/useAuth';

const Analytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalQuizAttempts: 0,
    averageScore: 0,
    quizzes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (user) {
        // Get user's quizzes
        const quizzesResult = await quizService.getUserQuizzes(user.uid);
        if (quizzesResult.success) {
          const quizzes = quizzesResult.quizzes;
          
          // Calculate stats
          let totalQuizAttempts = 0;
          let totalScore = 0;
          
          // For this example, we'll simulate quiz attempts and scores
          // In a real app, you would track quiz attempts in a separate collection
          quizzes.forEach(quiz => {
            // Simulate some attempts and scores for demo purposes
            const attempts = quiz.status === 'published' ? Math.floor(Math.random() * 10) + 1 : 0;
            totalQuizAttempts += attempts;
            
            // Simulate average score per quiz
            const avgScore = quiz.status === 'published' ? Math.floor(Math.random() * 40) + 60 : 0; // 60-100%
            totalScore += avgScore * attempts;
          });
          
          const averageScore = totalQuizAttempts > 0 ? Math.round(totalScore / totalQuizAttempts) : 0;
          
          setStats({
            totalQuizzes: quizzes.length,
            totalQuizAttempts,
            averageScore,
            quizzes
          });
        }
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">Track your quiz performance and engagement.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Quizzes</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalQuizzes}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Attempts</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.totalQuizAttempts}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Score</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.averageScore}%</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Performance Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quiz Performance</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed analytics for each of your quizzes.</p>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attempts
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.quizzes.map((quiz) => {
                // Simulate analytics data for each quiz
                const attempts = quiz.status === 'published' ? Math.floor(Math.random() * 10) + 1 : 0;
                const avgScore = quiz.status === 'published' ? Math.floor(Math.random() * 40) + 60 : 0; // 60-100%
                
                return (
                  <tr key={quiz.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                      <div className="text-sm text-gray-500">{quiz.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          quiz.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {quiz.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attempts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{avgScore}%</span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              avgScore >= 80 ? 'bg-green-500' : 
                              avgScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${avgScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quiz.questions?.length || 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Performing Quizzes</h3>
          <div className="space-y-4">
            {stats.quizzes
              .filter(quiz => quiz.status === 'published')
              .sort((a, b) => {
                // Simulate sorting by average score
                const avgScoreA = Math.floor(Math.random() * 40) + 60;
                const avgScoreB = Math.floor(Math.random() * 40) + 60;
                return avgScoreB - avgScoreA;
              })
              .slice(0, 3)
              .map((quiz, index) => {
                const avgScore = Math.floor(Math.random() * 40) + 60;
                return (
                  <div key={quiz.id} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                      <div className="text-sm text-gray-500">#{index + 1} top performer</div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{avgScore}% avg</div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">New Quiz Created</h4>
                <p className="text-sm text-gray-500">Quiz "JavaScript Basics" was created</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-500">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">Quiz Published</h4>
                <p className="text-sm text-gray-500">Quiz "React Fundamentals" was published</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-500">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">Quiz Updated</h4>
                <p className="text-sm text-gray-500">Quiz "CSS Mastery" was updated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;