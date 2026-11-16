import { previewResult, type QuizResult } from './result'
import { routes } from '@/routes'
import { useLocation, useNavigate } from 'react-router'

export default function Resultado() {
  const navigate = useNavigate()
  const location = useLocation()
  const { score, correct, total }: QuizResult = { ...previewResult, ...location.state }
  const xp = score + 20
  const pct = Math.round((correct / total) * 100)

  const getMessage = () => {
    if (pct === 100) return { emoji: '🏆', text: 'Perfeito! Você é um expert em cidadania!' }
    if (pct >= 80) return { emoji: '🌟', text: 'Excelente! Você domina o Poder Legislativo!' }
    if (pct >= 60) return { emoji: '👏', text: 'Muito bem! Continue estudando cidadania!' }
    return { emoji: '💪', text: 'Bom começo! Continue praticando e você vai melhorar!' }
  }

  const msg = getMessage()

  return (
    <div style={{ minHeight: '100vh', background: '#f0f5ff', display: 'flex', flexDirection: 'column' }}>

      {/* Top banner */}
      <div style={{
        background: 'linear-gradient(135deg, #122d6a 0%, #1b3f8b 60%, #2455b8 100%)',
        padding: '40px 24px 80px',
        textAlign: 'center',
        borderRadius: '0 0 40px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Confetti dots */}
        {[...Array(16)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 8, height: 8,
            borderRadius: '50%',
            background: ['#fbbf24','#f59e0b','#34d399','#60a5fa','#f472b6'][i % 5],
            top: `${10 + (i * 17) % 60}%`,
            left: `${(i * 23) % 90}%`,
            opacity: 0.6,
          }} />
        ))}

        <div style={{ fontSize: 56, marginBottom: 12 }}>{msg.emoji}</div>
        <h1 style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 900,
          fontSize: 28,
          color: 'white',
          margin: '0 0 8px',
        }}>
          Desafio concluído!
        </h1>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 600,
          fontSize: 15,
          color: 'rgba(255,255,255,0.75)',
          margin: 0,
          maxWidth: 280,
          marginInline: 'auto',
          lineHeight: 1.5,
        }}>
          {msg.text}
        </p>
      </div>

      {/* Score cards */}
      <div style={{ padding: '0 20px', marginTop: -36 }}>
        <div style={{
          background: 'white',
          borderRadius: 24,
          padding: '24px 20px',
          boxShadow: '0 8px 32px rgba(27,63,139,0.16)',
          border: '1px solid #e0eaff',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              { icon: '⭐', val: `${score}`, label: 'Pontuação', color: '#fef3c7', textColor: '#92400e' },
              { icon: '✅', val: `${correct}/${total}`, label: 'Acertos', color: '#dcfce7', textColor: '#166534' },
              { icon: '⚡', val: `+${xp}`, label: 'XP ganho', color: '#dbeafe', textColor: '#1e40af' },
            ].map(s => (
              <div key={s.label} style={{
                background: s.color,
                borderRadius: 14,
                padding: '14px 8px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 18, color: s.textColor }}>{s.val}</div>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: s.textColor, fontWeight: 700, opacity: 0.8 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Badge */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            border: '2px solid #f59e0b',
            borderRadius: 18,
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
              flexShrink: 0,
            }}>
              🏅
            </div>
            <div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800, color: '#92400e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
                Conquista desbloqueada!
              </div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 16, color: '#78350f' }}>
                Explorador do Parlamento
              </div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: '#92400e', fontWeight: 600, marginTop: 2 }}>
                Concluiu o desafio do Poder Legislativo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance bar */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          background: 'white',
          borderRadius: 18,
          padding: '18px 20px',
          border: '1px solid #e0eaff',
          boxShadow: '0 2px 8px rgba(27,63,139,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: '#1b3f8b' }}>Seu desempenho</span>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 13, color: pct >= 80 ? '#16a34a' : '#f59e0b' }}>{pct}%</span>
          </div>
          <div style={{ background: '#f0f5ff', borderRadius: 8, height: 10, overflow: 'hidden' }}>
            <div style={{
              width: `${pct}%`,
              height: '100%',
              background: pct >= 80 ? 'linear-gradient(90deg, #16a34a, #22c55e)' : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              borderRadius: 8,
              transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: '#9ca3af', fontWeight: 600, marginTop: 6, textAlign: 'center' }}>
            {correct} de {total} questões corretas
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
        <button
          onClick={() => navigate(routes.jornada)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #1b3f8b, #2455b8)',
            color: 'white',
            border: 'none',
            borderRadius: 16,
            padding: '16px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 900,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(27,63,139,0.35)',
          }}
        >
          🗺️ Continuar jornada
        </button>
        <button
          onClick={() => navigate(routes.progresso)}
          style={{
            width: '100%',
            background: 'white',
            color: '#1b3f8b',
            border: '2px solid #dbeafe',
            borderRadius: 16,
            padding: '14px',
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          📊 Ver meu progresso
        </button>
      </div>
    </div>
  )
}
