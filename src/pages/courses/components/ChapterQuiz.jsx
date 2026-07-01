import { useState } from 'react'
import { gradeQuiz } from '../utils.js'

export default function ChapterQuiz({
  quiz,
  chapterTitle,
  savedResult,
  onSubmit,
  onRetry,
}) {
  const [answers, setAnswers] = useState({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(!!savedResult)
  const [result, setResult] = useState(savedResult || null)
  const [showResults, setShowResults] = useState(!!savedResult)

  if (!quiz) {
    return (
      <div className="quiz-container">
        <div className="quiz-placeholder">
          <p>请先选择一个章节</p>
        </div>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length

  const handleSingleChoice = (questionId, optionIndex) => {
    if (isSubmitted) return
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }))
  }

  const handleMultipleChoice = (questionId, optionIndex) => {
    if (isSubmitted) return
    setAnswers((prev) => {
      const current = prev[questionId] || []
      const updated = current.includes(optionIndex)
        ? current.filter((i) => i !== optionIndex)
        : [...current, optionIndex]
      return {
        ...prev,
        [questionId]: updated,
      }
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    const quizResult = gradeQuiz(quiz.questions, answers)
    setResult(quizResult)
    setIsSubmitted(true)
    setShowResults(true)
    if (onSubmit) {
      onSubmit(quizResult)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setIsSubmitted(false)
    setResult(null)
    setShowResults(false)
    if (onRetry) {
      onRetry()
    }
  }

  const isQuestionAnswered = (question) => {
    const answer = answers[question.id]
    if (question.type === 'single') {
      return answer !== undefined
    }
    return Array.isArray(answer) && answer.length > 0
  }

  const getOptionClass = (question, optionIndex) => {
    const baseClass = 'quiz-option'
    const answer = answers[question.id]
    const isSelected =
      question.type === 'single'
        ? answer === optionIndex
        : Array.isArray(answer) && answer.includes(optionIndex)

    if (!isSubmitted) {
      return `${baseClass} ${isSelected ? 'selected' : ''}`
    }

    const isCorrectAnswer =
      question.type === 'single'
        ? question.answer === optionIndex
        : Array.isArray(question.answer) && question.answer.includes(optionIndex)

    if (isCorrectAnswer) {
      return `${baseClass} correct`
    }
    if (isSelected && !isCorrectAnswer) {
      return `${baseClass} wrong`
    }
    return baseClass
  }

  const answeredCount = quiz.questions.filter((q) => isQuestionAnswered(q)).length
  const allAnswered = answeredCount === totalQuestions

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2 className="quiz-title">{quiz.title}</h2>
        <p className="quiz-chapter">{chapterTitle}</p>
        <div className="quiz-info">
          <span>共 {totalQuestions} 题</span>
          <span>及格分：{quiz.passingScore} 分</span>
        </div>
      </div>

      {showResults && result ? (
        <div className="quiz-results">
          <div className="result-header">
            <h3>测验结果</h3>
            <div
              className={`score-circle ${
                result.score >= quiz.passingScore ? 'pass' : 'fail'
              }`}
            >
              <span className="score-value">{result.score}</span>
              <span className="score-label">分</span>
            </div>
          </div>

          <div className="result-stats">
            <div className="stat-item">
              <span className="stat-label">正确题数</span>
              <span className="stat-value correct">
                {result.correctCount}/{result.totalQuestions}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">正确率</span>
              <span className="stat-value">
                {((result.correctCount / result.totalQuestions) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">状态</span>
              <span
                className={`stat-value ${
                  result.score >= quiz.passingScore ? 'pass' : 'fail'
                }`}
              >
                {result.score >= quiz.passingScore ? '通过 ✓' : '未通过 ✗'}
              </span>
            </div>
          </div>

          <div className="result-detail">
            <h4>答题详情</h4>
            {result.results.map((r, index) => (
              <div
                key={r.questionId}
                className={`result-item ${r.isCorrect ? 'correct' : 'wrong'}`}
              >
                <div className="result-question">
                  <span className="question-number">{index + 1}.</span>
                  <span className="question-text">{r.question}</span>
                  <span className="question-status">
                    {r.isCorrect ? '✓' : '✗'}
                  </span>
                </div>
                {!r.isCorrect && (
                  <div className="result-answers">
                    <div className="wrong-answer">
                      你的答案：{formatAnswer(r.userAnswer, r.type)}
                    </div>
                    <div className="correct-answer">
                      正确答案：{formatAnswer(r.correctAnswer, r.type)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="retry-btn" onClick={handleRetry}>
            重新作答
          </button>
        </div>
      ) : (
        <>
          <div className="quiz-progress">
            <div className="progress-dots">
              {quiz.questions.map((q, index) => (
                <button
                  key={q.id}
                  className={`progress-dot ${
                    currentQuestionIndex === index ? 'active' : ''
                  } ${isQuestionAnswered(q) ? 'answered' : ''}`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="progress-text">
              第 {currentQuestionIndex + 1} / {totalQuestions} 题
            </div>
          </div>

          <div className="question-card">
            <div className="question-type">
              {currentQuestion.type === 'single' ? '单选题' : '多选题'}
            </div>
            <h3 className="question-text">{currentQuestion.question}</h3>

            <div className="options-list">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={getOptionClass(currentQuestion, index)}
                  onClick={() =>
                    currentQuestion.type === 'single'
                      ? handleSingleChoice(currentQuestion.id, index)
                      : handleMultipleChoice(currentQuestion.id, index)
                  }
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="option-text">{option}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="quiz-footer">
            <button
              className="nav-btn prev-btn"
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
            >
              上一题
            </button>

            <span className="answered-info">
              已答 {answeredCount}/{totalQuestions} 题
            </span>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <button
                className="nav-btn submit-btn"
                onClick={handleSubmit}
                disabled={!allAnswered}
              >
                提交答案
              </button>
            ) : (
              <button
                className="nav-btn next-btn"
                onClick={handleNext}
                disabled={!isQuestionAnswered(currentQuestion)}
              >
                下一题
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function formatAnswer(answer, type) {
  if (answer === undefined || answer === null) return '未作答'
  if (type === 'single') {
    return String.fromCharCode(65 + answer)
  }
  if (Array.isArray(answer)) {
    return answer.map((a) => String.fromCharCode(65 + a)).sort().join(', ')
  }
  return String(answer)
}
