import { useRef, useState } from 'react'
import { ROOM_PRESETS, type RoomPreset } from '../scene/roomPresets'
import { exportGlb } from '../scene/exportModel'
import { downloadFile } from '../scene/download'
import { exportName } from '../scene/exportScene'
import type { SceneGraph } from '../scene/types'

type RoomGalleryDialogProps = {
  onSelectRoom: (graph: SceneGraph) => void
  currentRoomId?: string
  disabled?: boolean
}

const CATEGORY_FILTERS = ['All', 'Commercial', 'Residential', 'Lounge'] as const
type CategoryFilter = typeof CATEGORY_FILTERS[number]

export function RoomGalleryDialog({
  onSelectRoom,
  currentRoomId,
  disabled = false,
}: RoomGalleryDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [filter, setFilter] = useState<CategoryFilter>('All')
  const [exportingId, setExportingId] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)

  function openModal() {
    setFeedbackMessage(null)
    dialog.current?.showModal()
  }

  function closeModal() {
    dialog.current?.close()
  }

  function handleSelect(preset: RoomPreset) {
    const graph = preset.load()
    onSelectRoom(graph)
    setFeedbackMessage(`Loaded "${preset.name}". Explore with camera or tap Play!`)
    setTimeout(() => {
      dialog.current?.close()
    }, 450)
  }

  async function handleExportGlb(preset: RoomPreset, e: React.MouseEvent) {
    e.stopPropagation()
    setExportingId(preset.id)
    try {
      const graph = preset.load()
      const name = exportName(graph, 'glb')
      const data = await exportGlb(graph)
      downloadFile(name, data as BlobPart, 'model/gltf-binary')
    } catch {
      setFeedbackMessage(`Failed to export ${preset.name} as GLB.`)
    } finally {
      setExportingId(null)
    }
  }

  const filteredPresets = ROOM_PRESETS.filter((preset) => {
    if (filter === 'All') return true
    return preset.category === filter
  })

  return (
    <>
      <button
        type="button"
        className="chip gallery-btn"
        disabled={disabled}
        onClick={openModal}
        title="Browse and load pre-built 3D room environments"
      >
        <span className="gallery-icon" aria-hidden="true">🏛️</span>
        Room Gallery
      </button>

      <dialog ref={dialog} className="capture-import room-gallery-dialog" aria-labelledby="room-gallery-title">
        <div className="capture-import-heading">
          <p className="panel-kicker">3D Environment Library</p>
          <button type="button" aria-label="Close Room Gallery" onClick={closeModal}>×</button>
        </div>

        <h2 id="room-gallery-title">Preset 3D Rooms Gallery</h2>
        <p className="room-gallery-subtitle">
          Instantly switch between high-detail 3D room models from GeoVision-AI's library. Each room is fully interactive with first-person navigation, furniture inspection, renovation editing, and .glb export.
        </p>

        {/* Filter chips */}
        <div className="gallery-filter-chips">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-chip ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'All' ? 'All Rooms (5)' : cat}
            </button>
          ))}
        </div>

        {feedbackMessage && (
          <div className="gallery-feedback-msg" role="status">
            ✓ {feedbackMessage}
          </div>
        )}

        {/* Room cards grid */}
        <div className="room-cards-grid">
          {filteredPresets.map((preset) => {
            const isCurrent = currentRoomId?.includes(preset.id.replace('preset-', ''))
            return (
              <div
                key={preset.id}
                className={`room-card ${isCurrent ? 'active-room' : ''}`}
                onClick={() => handleSelect(preset)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(preset) }}
                aria-label={`Load ${preset.name}`}
              >
                {/* Visual card header banner */}
                <div
                  className="room-card-banner"
                  style={{
                    background: `linear-gradient(135deg, rgba(20,24,35,0.95), rgba(10,12,18,0.98)), radial-gradient(circle at top right, ${preset.accentColor}33, transparent 70%)`,
                    borderBottom: `2px solid ${preset.accentColor}44`,
                  }}
                >
                  <div className="room-card-badges">
                    <span className="room-category-badge" style={{ borderColor: preset.accentColor, color: preset.accentColor }}>
                      {preset.category}
                    </span>
                    {preset.badge && <span className="room-highlight-badge">{preset.badge}</span>}
                  </div>
                  <h3 className="room-card-title">{preset.name}</h3>
                  <div className="room-card-metrics">
                    <span className="metric-pill">📐 {preset.dimensions}</span>
                    <span className="metric-pill">🪑 {preset.objectCount} objects</span>
                  </div>
                </div>

                {/* Card body */}
                <div className="room-card-body">
                  <p className="room-card-desc">{preset.description}</p>

                  <div className="room-features-list">
                    {preset.features.map((feat, idx) => (
                      <span key={idx} className="room-feature-tag">• {feat}</span>
                    ))}
                  </div>

                  <div className="room-card-actions">
                    <button
                      type="button"
                      className={`card-select-btn ${isCurrent ? 'current' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelect(preset)
                      }}
                    >
                      {isCurrent ? 'Current Room' : 'Load 3D Room'}
                    </button>
                    <button
                      type="button"
                      className="card-glb-btn ghost-button"
                      disabled={exportingId === preset.id}
                      onClick={(e) => { void handleExportGlb(preset, e) }}
                      title="Directly export as .glb 3D model"
                    >
                      {exportingId === preset.id ? '…' : '.GLB'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="gallery-dialog-footer">
          <p className="gallery-tip">
            💡 <em>Tip: Once loaded, click <strong>Play</strong> to walk inside with avatar controls, or <strong>Renovate</strong> to rearrange furniture.</em>
          </p>
          <button type="button" className="ghost-button" onClick={closeModal}>
            Close
          </button>
        </div>
      </dialog>
    </>
  )
}
