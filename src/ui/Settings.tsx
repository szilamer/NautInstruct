import { useState } from 'react'
import { useStore } from '../state/store'
import { DEFAULT_BASE_URL, DEFAULT_MODEL } from '../llm/settings'

export function Settings() {
  const llmSettings = useStore((s) => s.llmSettings)
  const updateLlmSettings = useStore((s) => s.updateLlmSettings)
  const navigate = useStore((s) => s.navigate)

  const [apiKey, setApiKey] = useState(llmSettings.apiKey)
  const [model, setModel] = useState(llmSettings.model)
  const [baseUrl, setBaseUrl] = useState(llmSettings.baseUrl)
  const [saved, setSaved] = useState(false)

  const save = () => {
    updateLlmSettings({
      apiKey: apiKey.trim(),
      model: model.trim() || DEFAULT_MODEL,
      baseUrl: baseUrl.trim() || DEFAULT_BASE_URL,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto h-full max-w-xl overflow-y-auto px-6 py-8">
      <h2 className="text-2xl font-bold">Beállítások</h2>
      <p className="mt-1 text-sm text-foam/70">
        Az AI-alapú, személyre szabott magyarázatokhoz add meg az OpenAI (vagy kompatibilis) API-kulcsodat.
        A kulcs kizárólag a böngésződben (localStorage) tárolódik, sehova máshova nem küldjük el – csak
        közvetlenül az LLM-szolgáltatónak.
      </p>

      <div className="mt-6 space-y-4">
        <Field label="API-kulcs">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-…"
            className="w-full rounded-lg border border-white/15 bg-sea-800 px-3 py-2 outline-none focus:border-sea-500"
          />
        </Field>
        <Field label="Modell">
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={DEFAULT_MODEL}
            className="w-full rounded-lg border border-white/15 bg-sea-800 px-3 py-2 outline-none focus:border-sea-500"
          />
        </Field>
        <Field label="API végpont (base URL)">
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder={DEFAULT_BASE_URL}
            className="w-full rounded-lg border border-white/15 bg-sea-800 px-3 py-2 outline-none focus:border-sea-500"
          />
        </Field>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={save}
          className="rounded-lg bg-sea-500 px-5 py-2 font-semibold transition hover:bg-sea-500/90"
        >
          Mentés
        </button>
        <button
          onClick={() => navigate('home')}
          className="rounded-lg border border-white/20 px-5 py-2 transition hover:bg-white/10"
        >
          Vissza
        </button>
        {saved && <span className="text-sm text-buoy-green">Elmentve ✓</span>}
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-sea-800/60 p-4 text-sm text-foam/70">
        <b>Kulcs nélkül is működik:</b> ilyenkor a szimulátor a beépített, sablonos magyarázatokat
        használja (opciós öndiagnózissal). Kulccsal az AI szabad szöveges választ is értékel, és
        természetes nyelvű magyarázatot ad.
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foam/80">{label}</span>
      {children}
    </label>
  )
}
