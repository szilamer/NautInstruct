import { useStore } from '../state/store'
import { captainRank, rankLabel } from '../engine/progress'
import { hasApiKey } from '../llm/settings'

export function TopBar() {
  const route = useStore((s) => s.route)
  const navigate = useStore((s) => s.navigate)
  const exitToHome = useStore((s) => s.exitToHome)
  const progress = useStore((s) => s.progress)
  const llmSettings = useStore((s) => s.llmSettings)
  const rank = captainRank(progress)

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-sea-900/80 px-4 py-3 backdrop-blur">
      <button
        onClick={exitToHome}
        className="flex items-center gap-2 text-left"
        aria-label="Főoldal"
      >
        <span className="text-2xl">⚓</span>
        <span>
          <span className="block text-sm font-bold tracking-wide">NautInstruct</span>
          <span className="block text-xs text-foam/60">AI hajóskapitány szimulátor</span>
        </span>
      </button>

      <nav className="flex items-center gap-1 text-sm">
        <span className="mr-2 hidden rounded-full bg-sea-700 px-3 py-1 text-xs sm:inline">
          Rang: <b>{rankLabel(rank)}</b>
        </span>
        <NavButton active={route === 'progress'} onClick={() => navigate('progress')}>
          Tudásprofil
        </NavButton>
        <NavButton active={route === 'settings'} onClick={() => navigate('settings')}>
          Beállítások {hasApiKey(llmSettings) ? '🟢' : '⚪'}
        </NavButton>
      </nav>
    </header>
  )
}

function NavButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 transition ${
        active ? 'bg-sea-500 text-white' : 'hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  )
}
