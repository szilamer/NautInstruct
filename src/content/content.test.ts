import { describe, expect, it } from 'vitest'
import { rules, ruleById } from './rules'
import { situations } from './situations'
import { missions } from '../nav/missions'

describe('tartalmi integritás — szituációk', () => {
  it('minden szituáció létező szabályra hivatkozik', () => {
    for (const s of situations) {
      expect(ruleById.has(s.ruleId), `${s.id} → ${s.ruleId}`).toBe(true)
    }
  })

  it('minden szituációnak van helyes és hibás döntése is', () => {
    for (const s of situations) {
      expect(s.decisions.some((d) => d.isCorrect), `${s.id} helyes döntés`).toBe(true)
      expect(s.decisions.some((d) => !d.isCorrect), `${s.id} hibás döntés`).toBe(true)
    }
  })

  it('minden hibás döntés a szabály létező hibatípusára mutat', () => {
    for (const s of situations) {
      const rule = ruleById.get(s.ruleId)!
      for (const d of s.decisions) {
        if (!d.isCorrect) {
          expect(rule.typicalErrors.some((e) => e.id === d.errorTypeId), `${s.id}/${d.id}`).toBe(true)
        }
      }
    }
  })

  it('minden szituációnak pontosan egy "pontos" öndiagnózis-opciója van', () => {
    for (const s of situations) {
      const pontos = s.diagnosisOptions.filter((o) => o.quality === 'pontos').length
      expect(pontos, `${s.id} pontos opciók`).toBe(1)
      expect(s.diagnosisOptions.some((o) => o.quality === 'reszben'), `${s.id} reszben`).toBe(true)
      expect(s.diagnosisOptions.some((o) => o.quality === 'teves'), `${s.id} teves`).toBe(true)
    }
  })

  it('egyedi szituáció-azonosítók', () => {
    const ids = situations.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('tartalmi integritás — szabályok és küldetések', () => {
  it('egyedi szabály-azonosítók', () => {
    const ids = rules.map((r) => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('minden szabálynak van mindhárom mélységű magyarázata', () => {
    for (const r of rules) {
      expect(r.explanations.rovid.length, `${r.id} rovid`).toBeGreaterThan(0)
      expect(r.explanations.kozepes.length, `${r.id} kozepes`).toBeGreaterThan(0)
      expect(r.explanations.reszletes.length, `${r.id} reszletes`).toBeGreaterThan(0)
    }
  })

  it('minden küldetés-szabálysértés létező szabályra mutat', () => {
    for (const m of missions) {
      for (const v of Object.values(m.violations)) {
        expect(ruleById.has(v!.ruleId), `${m.id} → ${v!.ruleId}`).toBe(true)
        const pontos = v!.diagnosisOptions.filter((o) => o.quality === 'pontos').length
        expect(pontos, `${m.id} pontos opció`).toBe(1)
      }
    }
  })
})
