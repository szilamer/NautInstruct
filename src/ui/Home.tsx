import { useStore } from '../state/store'
import { hasApiKey } from '../llm/settings'

export function Home() {
  const navigate = useStore((s) => s.navigate)
  const llmSettings = useStore((s) => s.llmSettings)

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-8 px-6 text-center">
      <div>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Tanulj hajózni <span className="text-sea-500">szituációkban</span>
        </h1>
        <p className="mt-4 text-foam/70">
          Nem leckéket olvasol, hanem hajózási helyzeteket oldasz meg. Ha hibázol, a szimulátor
          megáll, előbb rákérdez, mit gondolsz a hibáról, majd személyre szabottan elmagyarázza a
          helyes döntést.
        </p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-2">
        <button
          onClick={() => navigate('modes')}
          className="rounded-2xl bg-sea-500 p-6 text-left shadow-lg transition hover:bg-sea-500/90"
        >
          <div className="text-2xl">🧭</div>
          <div className="mt-2 text-lg font-bold">Küldetés / Szabad gyakorlás</div>
          <div className="text-sm text-white/80">
            Válassz témát: jelzések, éjszakai fények, rádiózás vagy horgonyzás.
          </div>
        </button>
        <button
          onClick={() => navigate('progress')}
          className="rounded-2xl bg-sea-700 p-6 text-left shadow-lg transition hover:bg-sea-700/90"
        >
          <div className="text-2xl">📊</div>
          <div className="mt-2 text-lg font-bold">Tudásprofil</div>
          <div className="text-sm text-white/80">
            Nézd meg, mely témákban vagy erős, és hol van még gyakorolnivaló.
          </div>
        </button>
      </div>

      {!hasApiKey(llmSettings) && (
        <button
          onClick={() => navigate('settings')}
          className="rounded-xl border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber"
        >
          💡 Az AI-magyarázatokhoz add meg az OpenAI API-kulcsodat a Beállításokban. Kulcs nélkül a
          szimulátor a beépített, sablonos magyarázatokat használja.
        </button>
      )}
    </div>
  )
}
