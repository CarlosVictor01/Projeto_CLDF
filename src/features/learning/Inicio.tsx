import { routes } from '@/routes'
import CLDFLogo from '@/components/CLDFLogo'
import { BottomNav } from './BottomNav'
import { useNavigate } from 'react-router'

import { Logout } from '../auth/Login'

export default function Inicio() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#f0f5ff', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #122d6a 0%, #1b3f8b 50%, #2455b8 100%)',
        padding: '20px 24px 0',
        borderRadius: '0 0 32px 32px',
        boxShadow: '0 4px 24px rgba(27,63,139,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <CLDFLogo />
          <span className="ml-auto text-white"><Logout role="participante" /></span>
        </div>

        <div style={{ textAlign: 'center', padding: '28px 16px 0' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 20,
            padding: '4px 14px',
            fontFamily: "'Nunito', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: '#fbbf24',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            🏛️ Plataforma Educativa
          </div>
          <h1 style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 900,
            fontSize: 28,
            color: 'white',
            margin: '0 0 8px',
            lineHeight: 1.15,
          }}>
            Educação para<br />a Cidadania
          </h1>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            color: 'rgba(255,255,255,0.8)',
            margin: '0 0 24px',
          }}>
            Aprenda, participe e conquiste!
          </p>
        </div>

        {/* XP bar inside header */}
        <div style={{
          background: 'rgba(255,255,255,0.10)',
          borderRadius: '16px 16px 0 0',
          padding: '16px 20px',
          margin: '0 -4px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                background: '#f59e0b',
                borderRadius: 10,
                padding: '2px 10px',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800,
                fontSize: 13,
                color: '#1b3f8b',
              }}>⭐ Nível 2</div>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                Aprendiz Cívico
              </span>
            </div>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, color: '#fbbf24' }}>
              320 XP
            </span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, height: 10, overflow: 'hidden' }}>
            <div style={{
              width: '64%',
              height: '100%',
              borderRadius: 8,
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
              boxShadow: '0 0 8px rgba(251,191,36,0.5)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>320 / 500 XP para o Nível 3</span>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>64%</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { icon: '🏆', val: '320', label: 'Pontos' },
            { icon: '✅', val: '3', label: 'Desafios' },
            { icon: '🎖️', val: '2', label: 'Conquistas' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'white',
              borderRadius: 16,
              padding: '14px 8px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(27,63,139,0.08)',
              border: '1px solid #e0eaff',
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 18, color: '#1b3f8b' }}>{s.val}</div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Continue card */}
        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: 20,
          boxShadow: '0 2px 12px rgba(27,63,139,0.10)',
          border: '1px solid #e0eaff',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700, color: '#2455b8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                📍 Continue sua jornada
              </div>
              <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 18, color: '#1b3f8b', margin: 0, lineHeight: 1.2 }}>
                Poder Legislativo
              </h3>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: '#6b7280', margin: '4px 0 0', fontWeight: 500 }}>
                Módulo 3 • 5 questões
              </p>
            </div>
            <div style={{
              background: '#f0f5ff',
              borderRadius: 12,
              padding: '10px 12px',
              fontSize: 28,
            }}>🏛️</div>
          </div>
          <div style={{ background: '#f0f5ff', borderRadius: 8, height: 8, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ width: '40%', height: '100%', background: 'linear-gradient(90deg, #2455b8, #3b82f6)', borderRadius: 8 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: '#6b7280', fontWeight: 600 }}>2 de 5 questões concluídas</span>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: '#2455b8', fontWeight: 700 }}>+80 XP</span>
          </div>
          <button
            onClick={() => navigate(routes.desafio)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #1b3f8b, #2455b8)',
              color: 'white',
              border: 'none',
              borderRadius: 14,
              padding: '14px',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: 16,
              cursor: 'pointer',
              letterSpacing: '0.02em',
              boxShadow: '0 4px 14px rgba(27,63,139,0.35)',
            }}
          >
            Continuar →
          </button>
        </div>

        {/* Projects */}
        <div>
          <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15, color: '#1b3f8b', margin: '0 0 12px', letterSpacing: '0.02em' }}>
            Projetos disponíveis
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🏫', name: 'Conhecendo o Parlamento', xp: '150 XP', color: '#dbeafe' },
              { icon: '🗳️', name: 'Nosso Parlamento', xp: '200 XP', color: '#ede9fe' },
              { icon: '🚀', name: 'Cidadania em Movimento', xp: '180 XP', color: '#dcfce7' },
            ].map(p => (
              <div key={p.name} onClick={() => navigate(routes.jornada)} style={{
                background: 'white',
                borderRadius: 14,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(27,63,139,0.07)',
                border: '1px solid #e0eaff',
              }}>
                <div style={{ background: p.color, borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14, color: '#1b3f8b' }}>{p.name}</div>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Trilha de aprendizagem</div>
                </div>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 800, color: '#f59e0b' }}>{p.xp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNav />
    </div>
  )
}
