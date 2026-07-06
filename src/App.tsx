import { missionById } from './nav/missions'
import { useStore } from './state/store'
import { Home } from './ui/Home'
import { ModeSelect } from './ui/ModeSelect'
import { NavPlay } from './ui/NavPlay'
import { Play } from './ui/Play'
import { Progress } from './ui/Progress'
import { Settings } from './ui/Settings'
import { TopBar } from './ui/TopBar'

export default function App() {
  const route = useStore((s) => s.route)
  const activeMissionId = useStore((s) => s.activeMissionId)
  const mission = activeMissionId ? missionById.get(activeMissionId) : undefined

  return (
    <div className="flex h-full flex-col">
      <TopBar />
      <main className="flex-1 overflow-hidden">
        {route === 'home' && <Home />}
        {route === 'modes' && <ModeSelect />}
        {route === 'play' && <Play />}
        {route === 'navplay' && mission && <NavPlay mission={mission} />}
        {route === 'progress' && <Progress />}
        {route === 'settings' && <Settings />}
      </main>
    </div>
  )
}
