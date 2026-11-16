import { routes } from '@/routes'
import { useQuiz } from './useQuiz'
import { useNavigate } from 'react-router'

export default function Desafio() {
  const navigate = useNavigate()
  const { current, selected, answered, score, q, total, progress, handleSelect, handleAnswer, handleNext } =
    useQuiz(result => navigate(routes.resultado, { state: result }))

  const optionLabels = ['A', 'B', 'C', 'D']

  const getOptionStyle = (idx: number) => {
    if (!answered) {
      return {
        background: selected === idx ? '#dbeafe' : 'white',
        border: selected === idx ? '2.5px solid #2455b8' : '2px solid #e0eaff',
        color: '#1b3f8b',
      }
    }
    if (idx === q.correct) return { background: '#dcfce7', border: '2.5px solid #16a34a', color: '#15803d' }
    if (idx === selected && selected !== q.correct) return { background: '#fee2e2', border: '2.5px solid #dc2626', color: '#b91c1c' }
    return { background: 'white', border: '2px solid #e0eaff', color: '#9ca3af' }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f5ff', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #122d6a 0%, #1b3f8b 100%)',
        padding: '20px 24px 20px',
        borderRadius: '0 0 24px 24px',
      }}>
        <button onClick={() => navigate(routes.jornada)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 13, padding: 0, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
          ← Voltar à jornada
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>⚖️ Poder Legislativo</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 15, color: 'white', marginTop: 2 }}>
              Pergunta {current + 1} de {total}
            </div>
          </div>
          <div style={{
            background: 'rgba(245,158,11,0.2)',
            border: '1.5px solid rgba(251,191,36,0.4)',
            borderRadius: 12,
            padding: '6px 14px',
          }}>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 14, color: '#fbbf24' }}>
              ⭐ {score}
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
            borderRadius: 8,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Question */}
      <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: '24px 20px',
          boxShadow: '0 4px 16px rgba(27,63,139,0.10)',
          border: '1px solid #e0eaff',
        }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 18, color: '#1b3f8b', lineHeight: 1.4 }}>
            {q.q}
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((opt, idx) => {
            const s = getOptionStyle(idx)
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                style={{
                  ...s,
                  borderRadius: 16,
                  padding: '16px 18px',
                  cursor: answered ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  textAlign: 'left',
                  transition: 'all 0.18s',
                  width: '100%',
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: answered && idx === q.correct
                    ? '#16a34a'
                    : answered && idx === selected && selected !== q.correct
                      ? '#dc2626'
                      : selected === idx
                        ? '#1b3f8b'
                        : '#e0eaff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 13, color: (selected === idx || (answered && idx === q.correct)) ? 'white' : '#6b7280' }}>
                    {answered && idx === q.correct ? '✓' : answered && idx === selected && selected !== q.correct ? '✗' : optionLabels[idx]}
                  </span>
                </div>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15 }}>{opt}</span>
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {answered && (
          <div style={{
            background: selected === q.correct ? '#dcfce7' : '#fee2e2',
            border: `2px solid ${selected === q.correct ? '#16a34a' : '#dc2626'}`,
            borderRadius: 16,
            padding: '16px 18px',
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{selected === q.correct ? '🎉' : '💡'}</span>
            <div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, color: selected === q.correct ? '#15803d' : '#b91c1c', marginBottom: 4 }}>
                {selected === q.correct ? 'Correto! +16 XP' : 'Quase lá! Sem pontos desta vez.'}
              </div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500, fontSize: 13, color: selected === q.correct ? '#166534' : '#991b1b', lineHeight: 1.5 }}>
                {q.explanation}
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ marginTop: 'auto', paddingTop: 8 }}>
          {!answered ? (
            <button
              onClick={handleAnswer}
              disabled={selected === null}
              style={{
                width: '100%',
                background: selected === null ? '#e0eaff' : 'linear-gradient(135deg, #1b3f8b, #2455b8)',
                color: selected === null ? '#93c5fd' : 'white',
                border: 'none',
                borderRadius: 16,
                padding: '16px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: 17,
                cursor: selected === null ? 'not-allowed' : 'pointer',
                boxShadow: selected !== null ? '0 6px 20px rgba(27,63,139,0.35)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Responder
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                color: 'white',
                border: 'none',
                borderRadius: 16,
                padding: '16px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: 17,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(22,163,74,0.35)',
              }}
            >
              {current < total - 1 ? 'Próxima pergunta →' : 'Ver resultado →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
