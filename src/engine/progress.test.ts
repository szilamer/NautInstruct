import { describe, expect, it } from 'vitest'
import {
  addErrorCard,
  captainRank,
  emptyProgress,
  recordAttempt,
  topicPercent,
  topicStatus,
} from './progress'

describe('progress', () => {
  it('üres profilnál 0% és matróz rang', () => {
    const p = emptyProgress()
    expect(topicPercent(p.topics.jelzesek)).toBe(0)
    expect(captainRank(p)).toBe('matroz')
  })

  it('rögzíti a próbálkozásokat és számolja a százalékot', () => {
    let p = emptyProgress()
    p = recordAttempt(p, 'jelzesek', true)
    p = recordAttempt(p, 'jelzesek', false)
    expect(p.topics.jelzesek.attempts).toBe(2)
    expect(topicPercent(p.topics.jelzesek)).toBe(50)
    expect(topicStatus(p.topics.jelzesek)).toBe('gyakorlo')
  })

  it('legalább egy próbálkozás után segédkapitány', () => {
    let p = emptyProgress()
    p = recordAttempt(p, 'radiozas', false)
    expect(captainRank(p)).toBe('segedkapitany')
  })

  it('stabil témakörnél folyami kapitány', () => {
    let p = emptyProgress()
    p = recordAttempt(p, 'fenyek', true)
    p = recordAttempt(p, 'fenyek', true)
    expect(topicStatus(p.topics.fenyek)).toBe('stabil')
    expect(captainRank(p)).toBe('folyami-kapitany')
  })

  it('minden témakör vizsgakész → vizsgakész kapitány', () => {
    let p = emptyProgress()
    for (const t of ['jelzesek', 'fenyek', 'radiozas', 'horgonyzas'] as const) {
      p = recordAttempt(p, t, true)
      p = recordAttempt(p, t, true)
      p = recordAttempt(p, t, true)
    }
    expect(captainRank(p)).toBe('vizsgakesz-kapitany')
  })

  it('a hibakártyát a lista elejére teszi', () => {
    let p = emptyProgress()
    p = addErrorCard(p, {
      id: '1',
      situationId: 's',
      topicId: 'jelzesek',
      ruleTitle: 'R',
      whatHappened: 'hiba',
      correctRule: 'helyes',
      at: 1,
    })
    expect(p.errorCards).toHaveLength(1)
    expect(p.errorCards[0].id).toBe('1')
  })
})
