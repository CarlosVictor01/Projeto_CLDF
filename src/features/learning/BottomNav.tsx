import { NavLink } from 'react-router'
import { routes } from '@/routes'

const items = [
  { path: routes.inicio, icon: '🏠', label: 'Início' },
  { path: routes.jornada, icon: '🗺️', label: 'Jornada' },
  { path: routes.progresso, icon: '📊', label: 'Progresso' },
]

export function BottomNav() {
  return (
    <nav aria-label="Navegação principal" className="sticky bottom-0 flex justify-around border-t border-blue-100 bg-white pt-2.5 pb-3.5">
      {items.map(item => (
        <NavLink key={item.path} to={item.path} end
          className="flex flex-col items-center gap-[3px] rounded-xl px-5 py-1 font-display text-[11px] font-semibold text-gray-400 aria-[current=page]:font-extrabold aria-[current=page]:text-cldf-blue">
          {({ isActive }) => (
            <>
              <span aria-hidden="true" className="text-[22px]">{item.icon}</span>
              {item.label}
              {isActive && <span className="size-1 rounded-full bg-cldf-blue" />}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
