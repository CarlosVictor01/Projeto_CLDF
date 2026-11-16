import { routes } from '@/routes'
import { Link, RouterProvider, createBrowserRouter, createHashRouter } from 'react-router'
import Inicio from './features/learning/Inicio'
import Jornada from './features/learning/Jornada'
import Desafio from './features/quiz/Desafio'
import Resultado from './features/quiz/Resultado'
import Progresso from './features/learning/Progresso'
import CriarQuiz from './features/admin/CriarQuiz'
import AdminDashboard from './features/admin/AdminDashboard'

import { PublishedQuizzes } from './features/admin/PublishedQuizzes'
import Participar, { type PublishedQuiz } from './features/quiz/Participar'
import { request } from './features/quiz/api'

import Login, { protect, adminLoginLoader } from './features/auth/Login'
const participant = protect('participante')
const admin = protect('admin')

const createRouter = import.meta.env.MODE === 'pages' ? createHashRouter : createBrowserRouter
const router = createRouter([
  { path: '/login', element: <Login key="participante" /> },
  { path: '/admin/login', loader: adminLoginLoader, element: <Login key="admin" admin /> },
  {
    path: '/participar/:id',
    Component: Participar,
    loader: async args => {
      await participant(args)
      return request<PublishedQuiz>('/api/quizzes/' + args.params.id + '/inscricao', {})
    },
    errorElement: <main className="p-6"><h1>Não foi possível abrir o quiz.</h1><p>Confira o link e a conexão com o servidor.</p><Link to="/">Voltar ao início</Link></main>,
  },
  { path: routes.inicio, loader: participant, Component: Inicio },
  { path: routes.jornada, loader: participant, Component: Jornada },
  { path: routes.desafio, loader: participant, Component: Desafio },
  { path: routes.resultado, loader: participant, Component: Resultado },
  { path: routes.progresso, loader: participant, Component: Progresso },
  { path: '/admin/quizzes', loader: admin, Component: PublishedQuizzes },
  { path: routes.admin, loader: admin, Component: AdminDashboard },
  { path: routes.criarQuiz, loader: admin, Component: CriarQuiz },
])

export default function App() {
  return <RouterProvider router={router} />
}
