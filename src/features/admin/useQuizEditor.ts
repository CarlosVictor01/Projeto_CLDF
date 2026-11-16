import { request } from '../quiz/api'
import { useMemo, useState } from 'react'

type Option = {
  id: number
  text: string
}

type Question = {
  id: number
  text: string
  options: Option[]
  correctOptionId: number | null
}

let nextId = 1

function createQuestion(): Question {
  const options = Array.from({ length: 4 }, () => ({ id: nextId++, text: '' }))
  return {
    id: nextId++,
    text: '',
    options,
    correctOptionId: null,
  }
}

export function useQuizEditor() {
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState<Question[]>(() => [createQuestion()])
  const [attemptedSave, setAttemptedSave] = useState(false)
  const [saved, setSaved] = useState(false)

  const [savedId, setSavedId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isComplete = useMemo(
    () =>
      title.trim().length > 0 &&
      questions.every(
        question =>
          question.text.trim().length > 0 &&
          question.options.length >= 2 &&
          question.options.every(option => option.text.trim().length > 0) &&
          question.correctOptionId !== null,
      ),
    [questions, title],
  )

  const updateQuestion = (questionId: number, text: string) => {
    setSaved(false)
    setQuestions(current => current.map(question => (question.id === questionId ? { ...question, text } : question)))
  }

  const updateOption = (questionId: number, optionId: number, text: string) => {
    setSaved(false)
    setQuestions(current =>
      current.map(question =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map(option => (option.id === optionId ? { ...option, text } : option)),
            }
          : question,
      ),
    )
  }

  const addQuestion = () => {
    setSaved(false)
    setQuestions(current => [...current, createQuestion()])
  }

  const removeQuestion = (questionId: number) => {
    setSaved(false)
    setQuestions(current => current.filter(question => question.id !== questionId))
  }

  const addOption = (questionId: number) => {
    setSaved(false)
    setQuestions(current =>
      current.map(question =>
        question.id === questionId && question.options.length < 6
          ? { ...question, options: [...question.options, { id: nextId++, text: '' }] }
          : question,
      ),
    )
  }

  const removeOption = (questionId: number, optionId: number) => {
    setSaved(false)
    setQuestions(current =>
      current.map(question =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.filter(option => option.id !== optionId),
              correctOptionId: question.correctOptionId === optionId ? null : question.correctOptionId,
            }
          : question,
      ),
    )
  }

  const selectCorrectOption = (questionId: number, optionId: number) => {
    setSaved(false)
    setQuestions(current =>
      current.map(question => (question.id === questionId ? { ...question, correctOptionId: optionId } : question)),
    )
  }

  const saveQuiz = async () => {
    setAttemptedSave(true)
    if (!isComplete) {
      setSaved(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (saving || saved) return
    setSaving(true)
    setError('')
    try {
      const payload = questions.map(q => ({
        text: q.text, options: q.options.map(o => o.text), correct: q.options.findIndex(o => o.id === q.correctOptionId),
      }))
      const quiz = await request<{ id: string }>('/api/quizzes', { title, questions: payload })
      setSavedId(quiz.id)
      setSaved(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Falha ao salvar o quiz.')
    } finally {
      setSaving(false)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    title,
    setTitle,
    questions,
    savedId, saving, error,
    attemptedSave,
    saved,
    setSaved,
    isComplete,
    updateQuestion,
    updateOption,
    addQuestion,
    removeQuestion,
    addOption,
    removeOption,
    selectCorrectOption,
    saveQuiz,
  }
}
