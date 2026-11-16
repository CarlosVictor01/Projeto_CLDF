import { routes } from '@/routes'
import { useQuizEditor } from './useQuizEditor'
import { ArrowLeftIcon, PlusIcon, TrashIcon, CheckIcon } from './icons'
import { Link, useNavigate } from 'react-router'

export default function CriarQuiz() {
  const navigate = useNavigate()
  const {
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
  } = useQuizEditor()
  return (
    <div className="min-h-screen bg-cldf-bg pb-28 font-body text-slate-900">
      <header className="bg-gradient-to-br from-cldf-blue-dark to-cldf-blue-mid text-white shadow-lg">
        <div className="mx-auto max-w-3xl px-5 pb-8 pt-5">
          <div className="mb-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(routes.admin)}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 font-display text-sm font-bold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cldf-gold"
            >
              <ArrowLeftIcon />
              Voltar
            </button>
            <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-display text-xs font-extrabold tracking-wider text-white/80">
              ÁREA ADMINISTRATIVA
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-2 font-display text-sm font-extrabold uppercase tracking-widest text-amber-300">
              Conteúdo educativo
            </p>
            <h1 className="m-0 font-display text-3xl font-black leading-tight">Criar novo quiz</h1>
            <p className="mb-0 mt-2 max-w-lg text-sm font-medium leading-relaxed text-white/70">
              Organize perguntas e respostas para ampliar as trilhas de aprendizagem sobre cidadania.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-3 max-w-3xl px-5 pb-8">
        {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
        <fieldset disabled={saving}>
        {saved && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800 shadow-sm" role="status">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
              <CheckIcon />
            </div>
            <div>
              <p className="m-0 font-display text-sm font-extrabold">Quiz salvo com sucesso</p>
              <p className="mb-0 mt-1 text-xs font-medium text-green-700">
                <Link className="block underline" to={'/participar/' + savedId}>Abrir link de participação</Link>
                “{title}” está pronto com {questions.length} {questions.length === 1 ? 'pergunta' : 'perguntas'}.
              </p>
            </div>
          </div>
        )}

        {attemptedSave && !isComplete && (
          <div className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-900" role="alert">
            Preencha o título, todas as perguntas e opções, e marque uma resposta correta em cada questão.
          </div>
        )}

        <section className="mb-5 rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="m-0 font-display text-xs font-extrabold uppercase tracking-widest text-cldf-blue-mid">Informações básicas</p>
              <h2 className="mb-0 mt-1 font-display text-lg font-black text-cldf-blue">Sobre o quiz</h2>
            </div>
            <span className="rounded-lg bg-cldf-blue-light px-2.5 py-1 font-display text-xs font-extrabold text-cldf-blue">1 etapa</span>
          </div>

          <label htmlFor="quiz-title" className="mb-2 block font-display text-sm font-extrabold text-slate-700">
            Título do quiz
          </label>
          <input
            id="quiz-title"
            value={title}
            maxLength={80}
            onChange={event => {
              setTitle(event.target.value)
              setSaved(false)
            }}
            placeholder="Ex.: Participação cidadã"
            className={`w-full rounded-2xl border bg-slate-50 px-4 py-3.5 font-display text-base font-bold text-cldf-blue outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-100 ${
              attemptedSave && !title.trim() ? 'border-red-400' : 'border-slate-200 focus:border-cldf-blue-mid'
            }`}
          />
          <div className="mt-2 flex justify-between text-xs font-semibold text-slate-400">
            <span>Use um título claro e objetivo.</span>
            <span>{title.length}/80</span>
          </div>
        </section>

        <div className="mb-3 flex items-end justify-between px-1">
          <div>
            <p className="m-0 font-display text-xs font-extrabold uppercase tracking-widest text-cldf-blue-mid">Conteúdo</p>
            <h2 className="mb-0 mt-1 font-display text-xl font-black text-cldf-blue">Perguntas</h2>
          </div>
          <span className="font-display text-sm font-extrabold text-slate-500">
            {questions.length} {questions.length === 1 ? 'questão' : 'questões'}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {questions.map((question, questionIndex) => {
            const questionIncomplete =
              attemptedSave &&
              (!question.text.trim() ||
                question.options.some(option => !option.text.trim()) ||
                question.correctOptionId === null)

            return (
              <section
                key={question.id}
                className={`overflow-hidden rounded-3xl border bg-white shadow-sm ${
                  questionIncomplete ? 'border-amber-300' : 'border-blue-100'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cldf-blue font-display text-sm font-black text-white">
                      {String(questionIndex + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <p className="m-0 font-display text-sm font-black text-cldf-blue">Questão {questionIndex + 1}</p>
                      <p className="m-0 text-xs font-semibold text-slate-400">Escolha uma resposta correta</p>
                    </div>
                  </div>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      aria-label={`Excluir questão ${questionIndex + 1}`}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                    >
                      <TrashIcon />
                    </button>
                  )}
                </div>

                <div className="p-5">
                  <label htmlFor={`question-${question.id}`} className="mb-2 block font-display text-sm font-extrabold text-slate-700">
                    Enunciado
                  </label>
                  <textarea
                    id={`question-${question.id}`}
                    value={question.text}
                    onChange={event => updateQuestion(question.id, event.target.value)}
                    rows={3}
                    placeholder="Digite a pergunta que será apresentada aos participantes"
                    className={`w-full resize-none rounded-2xl border bg-slate-50 px-4 py-3 font-display text-sm font-bold leading-relaxed text-cldf-blue outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-blue-100 ${
                      attemptedSave && !question.text.trim() ? 'border-red-400' : 'border-slate-200 focus:border-cldf-blue-mid'
                    }`}
                  />

                  <fieldset className="mt-5">
                    <legend className="mb-3 flex w-full items-center justify-between">
                      <span className="font-display text-sm font-extrabold text-slate-700">Opções de resposta</span>
                      <span className="text-xs font-semibold text-slate-400">Marque a correta</span>
                    </legend>

                    <div className="flex flex-col gap-2.5">
                      {question.options.map((option, optionIndex) => {
                        const selected = question.correctOptionId === option.id
                        return (
                          <div
                            key={option.id}
                            className={`flex items-center gap-3 rounded-2xl border p-2.5 transition ${
                              selected ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-white focus-within:border-cldf-blue-mid'
                            }`}
                          >
                            <label className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={selected}
                                onChange={() => selectCorrectOption(question.id, option.id)}
                                className="peer sr-only"
                                aria-label={`Marcar opção ${optionIndex + 1} como correta`}
                              />
                              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-300 font-display text-xs font-black text-slate-500 transition peer-checked:border-green-600 peer-checked:bg-green-600 peer-checked:text-white peer-focus:ring-4 peer-focus:ring-green-100">
                                {selected ? <CheckIcon /> : String.fromCharCode(65 + optionIndex)}
                              </span>
                            </label>
                            <input
                              value={option.text}
                              onChange={event => updateOption(question.id, option.id, event.target.value)}
                              placeholder={`Opção ${String.fromCharCode(65 + optionIndex)}`}
                              className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2 font-display text-sm font-bold text-slate-700 outline-none placeholder:font-medium placeholder:text-slate-400"
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(question.id, option.id)}
                                aria-label={`Remover opção ${String.fromCharCode(65 + optionIndex)}`}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                              >
                                <TrashIcon />
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {question.correctOptionId === null && attemptedSave && (
                      <p className="mb-0 mt-2 text-xs font-bold text-red-600">Selecione a resposta correta.</p>
                    )}

                    <button
                      type="button"
                      onClick={() => addOption(question.id)}
                      disabled={question.options.length >= 6}
                      className="mt-3 flex items-center gap-2 rounded-xl px-2 py-2 font-display text-sm font-extrabold text-cldf-blue-mid transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                    >
                      <PlusIcon />
                      Adicionar opção
                    </button>
                  </fieldset>
                </div>
              </section>
            )
          })}
        </div>

        <button
          type="button"
          onClick={addQuestion}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-blue-200 bg-white/60 px-5 py-4 font-display text-sm font-black text-cldf-blue-mid transition hover:border-cldf-blue-mid hover:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          <PlusIcon />
          Adicionar nova pergunta
        </button>
        </fieldset>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-blue-100 bg-white/95 px-5 py-4 shadow-2xl backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="m-0 font-display text-sm font-black text-cldf-blue">Pronto para salvar?</p>
            <p className="m-0 text-xs font-semibold text-slate-400">Revise o conteúdo antes de concluir.</p>
          </div>
          <button
            type="button"
            onClick={saveQuiz} disabled={saving || saved}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cldf-blue to-cldf-blue-mid px-6 py-3.5 font-display text-base font-black text-white shadow-lg transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-blue-200 sm:w-auto"
          >
            <CheckIcon />
            {saving ? 'Salvando…' : saved ? 'Quiz salvo' : 'Salvar quiz'}
          </button>
        </div>
      </div>
    </div>
  )
}
