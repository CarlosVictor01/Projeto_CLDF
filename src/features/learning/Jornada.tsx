import { routes } from '@/routes'
import { steps } from './journey'
import { useNavigate } from 'react-router'
import { BottomNav } from './BottomNav'

export default function Jornada() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#f0f5ff', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #122d6a 0%, #1b3f8b 100%)',
        padding: '20px 24px 24px',
        borderRadius: '0 0 28px 28px',
      }}>
        <button onClick={() => navigate(routes.inicio)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 13, padding: 0, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
          ← Voltar
        </button>
        <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 26, color: 'white', margin: '0 0 6px' }}>
          🗺️ Minha Jornada
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
          Poder Legislativo do DF
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '6px 14px' }}>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 800, color: '#fbbf24' }}>⭐ 320 XP</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '6px 14px' }}>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700, color: 'white' }}>2 de 5 concluídas</span>
          </div>
        </div>
      </div>

      {/* Trail */}
      <div style={{ flex: 1, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {steps.map((step, idx) => {
          const isDone = step.status === 'done'
          const isActive = step.status === 'active'
          const isLocked = step.status === 'locked'
          const isLast = idx === steps.length - 1

          return (
            <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Card */}
              <div style={{
                width: '100%',
                background: isLocked ? '#f8faff' : 'white',
                borderRadius: 18,
                padding: '16px 18px',
                border: isActive
                  ? '2.5px solid #2455b8'
                  : isDone
                    ? '2px solid #dcfce7'
                    : '1.5px solid #e5e7eb',
                boxShadow: isActive
                  ? '0 4px 20px rgba(36,85,184,0.18)'
                  : isDone
                    ? '0 2px 8px rgba(22,163,74,0.08)'
                    : '0 1px 4px rgba(0,0,0,0.04)',
                opacity: isLocked ? 0.65 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                position: 'relative',
              }}>
                {/* Icon circle */}
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  background: isDone
                    ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                    : isActive
                      ? 'linear-gradient(135deg, #1b3f8b, #2455b8)'
                      : '#e5e7eb',
                  boxShadow: isActive ? '0 4px 12px rgba(27,63,139,0.3)' : isDone ? '0 4px 10px rgba(22,163,74,0.25)' : 'none',
                }}>
                  {isLocked ? '🔒' : isDone ? '✅' : step.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 15, color: isLocked ? '#9ca3af' : '#1b3f8b' }}>
                      {step.title}
                    </div>
                    {isActive && (
                      <div style={{ background: '#dbeafe', borderRadius: 6, padding: '1px 8px', fontFamily: "'Nunito', sans-serif", fontSize: 10, fontWeight: 800, color: '#1b3f8b', letterSpacing: '0.04em' }}>
                        DISPONÍVEL
                      </div>
                    )}
                    {isDone && (
                      <div style={{ background: '#dcfce7', borderRadius: 6, padding: '1px 8px', fontFamily: "'Nunito', sans-serif", fontSize: 10, fontWeight: 800, color: '#16a34a' }}>
                        CONCLUÍDO
                      </div>
                    )}
                  </div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: '#6b7280', fontWeight: 500, marginBottom: 4 }}>{step.desc}</div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 800, color: isLocked ? '#d1d5db' : '#f59e0b' }}>
                    +{step.xp} XP
                  </div>
                </div>

                {!isLocked && <button className="rounded-lg border border-blue-200 px-2 py-1 font-bold text-cldf-blue" onClick={() => navigate('/participar/cd1f0000-0000-4000-8000-00000000000' + step.id)}>Abrir quiz</button>}

                {/* Step number */}
                <div style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900,
                  fontSize: 11,
                  color: isLocked ? '#d1d5db' : isDone ? '#22c55e' : '#2455b8',
                  letterSpacing: '0.05em',
                }}>
                  {String(step.id).padStart(2, '0')}
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div style={{
                  width: 3,
                  height: 20,
                  borderRadius: 2,
                  background: isDone ? '#22c55e' : '#e0eaff',
                  margin: '4px 0',
                }} />
              )}
            </div>
          )
        })}

        {/* CTA */}
        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => navigate(routes.desafio)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #1b3f8b, #2455b8)',
              color: 'white',
              border: 'none',
              borderRadius: 16,
              padding: '16px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: 17,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(27,63,139,0.35)',
              letterSpacing: '0.02em',
            }}
          >
            ⚡ Iniciar desafio: Poder Legislativo
          </button>
          <p style={{ textAlign: 'center', fontFamily: "'Nunito', sans-serif", fontSize: 12, color: '#9ca3af', fontWeight: 600, margin: '10px 0 0' }}>
            5 questões • ~5 minutos • +80 XP
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
