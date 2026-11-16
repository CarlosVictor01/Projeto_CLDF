import { routes } from '@/routes'
import { steps } from './journey'
import { conquistas } from './progress'
import { useNavigate } from 'react-router'
import { BottomNav } from './BottomNav'

export default function Progresso() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#f0f5ff', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #122d6a 0%, #1b3f8b 100%)',
        padding: '20px 24px 28px',
        borderRadius: '0 0 28px 28px',
      }}>
        <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 26, color: 'white', margin: '0 0 4px' }}>
          📊 Meu Progresso
        </h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: '0 0 20px' }}>
          Sua jornada na cidadania
        </p>

        {/* Level card */}
        <div style={{
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 18,
          padding: '16px 18px',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15, color: 'white' }}>Nível 2 — Aprendiz Cívico</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginTop: 2 }}>Próximo: Cidadão Engajado</div>
            </div>
            <div style={{
              background: '#f59e0b',
              borderRadius: 12,
              padding: '4px 12px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: 20,
              color: '#1b3f8b',
            }}>⭐ 2</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, height: 10, overflow: 'hidden', marginBottom: 4 }}>
            <div style={{ width: '64%', height: '100%', background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', borderRadius: 8 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>320 XP acumulados</span>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>500 XP para Nível 3</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { icon: '⭐', val: '320', label: 'XP Total', color: '#fef3c7', valColor: '#92400e' },
            { icon: '🎯', val: '3', label: 'Desafios', color: '#dcfce7', valColor: '#166534' },
            { icon: '🛤️', val: '2/5', label: 'Trilhas', color: '#dbeafe', valColor: '#1e40af' },
            { icon: '🎖️', val: '2/5', label: 'Conquistas', color: '#ede9fe', valColor: '#6d28d9' },
          ].map(s => (
            <div key={s.label} style={{
              background: s.color,
              borderRadius: 16,
              padding: '18px 16px',
              display: 'flex',
              gap: 12,
              alignItems: 'center',
            }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 22, color: s.valColor, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: s.valColor, fontWeight: 700, opacity: 0.75 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trilhas */}
        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: '18px 18px',
          boxShadow: '0 2px 10px rgba(27,63,139,0.07)',
          border: '1px solid #e0eaff',
        }}>
          <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15, color: '#1b3f8b', margin: '0 0 14px' }}>
            🛤️ Trilhas de aprendizagem
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((step, i) => {
              const done = step.status === 'done'
              return (
                <div key={step.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: i < steps.length - 1 ? '1px solid #f0f5ff' : 'none',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: done ? '#dcfce7' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {done ? '✅' : step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: done ? '#1b3f8b' : '#9ca3af' }}>{step.title}</div>
                  </div>
                  <div style={{
                    background: done ? '#dcfce7' : '#f3f4f6',
                    borderRadius: 8,
                    padding: '2px 10px',
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: 11,
                    fontWeight: 800,
                    color: done ? '#16a34a' : '#9ca3af',
                  }}>
                    {done ? 'Concluído' : 'Pendente'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Conquistas */}
        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: '18px 18px',
          boxShadow: '0 2px 10px rgba(27,63,139,0.07)',
          border: '1px solid #e0eaff',
        }}>
          <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15, color: '#1b3f8b', margin: '0 0 14px' }}>
            🎖️ Minhas conquistas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {conquistas.map((c, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: c.unlocked ? '#fef9ec' : '#fafafa',
                border: c.unlocked ? '1.5px solid #f59e0b' : '1.5px solid #e5e7eb',
                borderRadius: 14,
                padding: '12px 14px',
                opacity: c.unlocked ? 1 : 0.6,
              }}>
                <span style={{ fontSize: 28 }}>{c.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: c.unlocked ? '#92400e' : '#6b7280' }}>{c.name}</div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: c.unlocked ? '#a16207' : '#9ca3af', fontWeight: 500, marginTop: 2 }}>{c.desc}</div>
                </div>
                {c.unlocked && <span style={{ fontSize: 16 }}>✨</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Motivational message */}
        <div style={{
          background: 'linear-gradient(135deg, #1b3f8b, #2455b8)',
          borderRadius: 18,
          padding: '18px 20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🚀</div>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: '0 0 14px', lineHeight: 1.5 }}>
            Continue aprendendo para desbloquear novas conquistas!
          </p>
          <button
            onClick={() => navigate(routes.jornada)}
            style={{
              background: '#f59e0b',
              color: '#1b3f8b',
              border: 'none',
              borderRadius: 12,
              padding: '10px 24px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Continuar jornada →
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
