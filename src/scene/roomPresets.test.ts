import { describe, expect, it } from 'vitest'
import { ROOM_PRESETS, getPresetById } from './roomPresets'

describe('roomPresets', () => {
  it('defines 5 curated presets', () => {
    expect(ROOM_PRESETS).toHaveLength(5)
  })

  it('provides getPresetById', () => {
    expect(getPresetById('preset-cafe')).toBeDefined()
    expect(getPresetById('preset-boardroom')).toBeDefined()
    expect(getPresetById('preset-living')).toBeDefined()
    expect(getPresetById('preset-bedroom')).toBeDefined()
    expect(getPresetById('preset-office')).toBeDefined()
    expect(getPresetById('non-existent')).toBeUndefined()
  })

  ROOM_PRESETS.forEach((preset) => {
    it(`generates valid SceneGraph for "${preset.name}"`, () => {
      const graph = preset.load()
      expect(graph.room).toBeDefined()
      expect(graph.room.width).toBeGreaterThan(0)
      expect(graph.room.depth).toBeGreaterThan(0)
      expect(graph.room.height).toBeGreaterThan(0)
      expect(graph.objects.length).toBeGreaterThan(0)

      const ids = new Set<string>()
      graph.objects.forEach((obj) => {
        expect(obj.id).toBeTruthy()
        expect(ids.has(obj.id)).toBe(false)
        ids.add(obj.id)
        expect(obj.position).toHaveLength(3)
        expect(obj.size).toHaveLength(3)
        expect(obj.size[0]).toBeGreaterThan(0)
        expect(obj.size[1]).toBeGreaterThan(0)
        expect(obj.size[2]).toBeGreaterThan(0)
      })
    })
  })
})
