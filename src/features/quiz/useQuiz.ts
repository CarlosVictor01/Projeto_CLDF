import { useState } from 'react'
import { questions } from './questions'
import type { QuizResult } from './result'

export function useQuiz(onComplete: (result: QuizResult) => void) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const score = correctCount * 16
  const q = questions[current]
  const total = questions.length
  const progress = ((current) / total) * 100

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelected(idx)
  }

  const handleAnswer = () => {
    if (answered || selected === null) return
    setAnswered(true)
    if (selected === q.correct) {
      setCorrectCount(c => c + 1)
    }
  }

  const handleNext = () => {
    if (current < total - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      onComplete({ score, correct: correctCount, total })
    }
  }

  return { current, selected, answered, score, q, total, progress, handleSelect, handleAnswer, handleNext }
}
