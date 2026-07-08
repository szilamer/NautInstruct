// Térképi geometria (tiszta függvények). Koordináták: x = kelet (jobbra), y = dél (lefelé),
// tehát ÉSZAK = felfelé (csökkenő y), a képernyős SVG-koordinátákhoz igazítva.

export interface Point {
  x: number
  y: number
}

const TWO_PI = Math.PI * 2

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI
}

/** Két pont távolsága. */
export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/**
 * Iránylat (bearing) az `from` pontból a `to` pontba: az északtól (felfelé) az óramutató
 * járásával megegyezően mért szög, 0–360 fok.
 */
export function bearing(from: Point, to: Point): number {
  const east = to.x - from.x
  const north = from.y - to.y // észak = felfelé = csökkenő y
  let deg = toDeg(Math.atan2(east, north))
  if (deg < 0) deg += 360
  return deg
}

/** Két szög (fok) közti legkisebb abszolút eltérés (0–180). */
export function angleDiff(a: number, b: number): number {
  let d = Math.abs(((a - b) % 360) + 360) % 360
  if (d > 180) d = 360 - d
  return d
}

/**
 * Relatív iránylat (orrszög): a céltárgy iránya a hajó orrvonalához képest.
 * Visszaad egy értéket -180..180 fok között (pozitív = jobbra/starboard, negatív = balra/port),
 * és az oldalt a színnel (zöld = jobbra, vörös = balra).
 */
export function relativeBearing(heading: number, targetBearing: number): { angle: number; side: 'zold' | 'voros' } {
  let rel = ((targetBearing - heading + 540) % 360) - 180 // -180..180
  if (Object.is(rel, -0)) rel = 0
  return { angle: rel, side: rel >= 0 ? 'zold' : 'voros' }
}

/** Egy pontból adott irányba (bearing, fok) mutató egységvektor (x=kelet, y=dél). */
export function bearingUnitVector(deg: number): Point {
  const rad = (deg * Math.PI) / 180
  return { x: Math.sin(rad), y: -Math.cos(rad) }
}

/**
 * Két iránylat-egyenes metszéspontja (helymeghatározás irányméréssel).
 * p1-ből b1, p2-ből b2 irányban indul egy-egy egyenes; visszaadja a metszéspontot, vagy null-t,
 * ha az egyenesek (közel) párhuzamosak.
 */
export function intersectionOfBearings(p1: Point, b1: number, p2: Point, b2: number): Point | null {
  const d1 = bearingUnitVector(b1)
  const d2 = bearingUnitVector(b2)
  const denom = d1.x * d2.y - d1.y * d2.x
  if (Math.abs(denom) < 1e-9) return null
  const t = ((p2.x - p1.x) * d2.y - (p2.y - p1.y) * d2.x) / denom
  return { x: p1.x + d1.x * t, y: p1.y + d1.y * t }
}

export { TWO_PI }
