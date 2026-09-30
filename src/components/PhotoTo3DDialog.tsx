import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { sceneFromImage } from '../api/scene'
import { exportGlb } from '../scene/exportModel'
import { downloadFile } from '../scene/download'
import { exportName } from '../scene/exportScene'
import type { SceneGraph } from '../scene/types'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10MB

export type RoomTypeOption = {
  id: string
  label: string
  hint: string
}

const ROOM_TYPES: RoomTypeOption[] = [
  { id: '', label: 'Auto-detect from Photo', hint: 'AI determines layout and room category' },
  { id: 'living room', label: 'Living Room & Lounge', hint: 'Sofa, coffee table, armchairs, TV console & plants' },
  { id: 'bedroom', label: 'Bedroom & Studio', hint: 'Master bed, nightstands, wardrobe closet & study desk' },
  { id: 'office', label: 'Office & Boardroom', hint: 'Conference table, swivel chairs, display screen & credenza' },
  { id: 'dining', label: 'Dining Room & Kitchen', hint: 'Dining table, standard chairs, buffet sideboard & pendant' },
]

// High-detail sample SVGs encoded as data URLs for 1-click testing
function makeSampleDataUrl(label: string, subtitle: string, bgGradient: [string, string], icon: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradient[0]}" />
        <stop offset="100%" stop-color="${bgGradient[1]}" />
      </linearGradient>
    </defs>
    <rect width="640" height="480" fill="url(#bg)" />
    <!-- Floor grid perspective -->
    <path d="M0,320 L640,320 M0,480 L200,320 M640,480 L440,320 M160,480 L280,320 M480,480 L360,320" stroke="rgba(255,255,255,0.08)" stroke-width="2" />
    <!-- Room perspective walls -->
    <line x1="0" y1="0" x2="200" y2="320" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
    <line x1="640" y1="0" x2="440" y2="320" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
    <line x1="200" y1="0" x2="200" y2="320" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
    <line x1="440" y1="0" x2="440" y2="320" stroke="rgba(255,255,255,0.06)" stroke-width="2" />
    <text x="320" y="160" font-family="system-ui, sans-serif" font-size="54" text-anchor="middle" fill="white" opacity="0.9">${icon}</text>
    <text x="320" y="225" font-family="system-ui, sans-serif" font-size="24" font-weight="600" text-anchor="middle" fill="white">${label}</text>
    <text x="320" y="255" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle" fill="rgba(255,255,255,0.7)">${subtitle}</text>
    <rect x="230" y="280" width="180" height="30" rx="15" fill="rgba(255,255,255,0.15)" />
    <text x="320" y="300" font-family="system-ui, sans-serif" font-size="12" font-weight="500" text-anchor="middle" fill="#3ee0c2">SAMPLE PHOTO</text>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const SAMPLE_PHOTOS = [
  {
    name: 'Sample Living Room',
    type: 'living room',
    url: makeSampleDataUrl('Living Room & Lounge', 'Modern open space with sofa & coffee table', ['#1e3799', '#0c2461'], '🛋️'),
  },
  {
    name: 'Sample Executive Boardroom',
    type: 'office',
    url: makeSampleDataUrl('Executive Boardroom', 'Conference table with swivel chairs & screen', ['#2C3A47', '#130f40'], '🏢'),
  },
  {
    name: 'Sample Studio Bedroom',
    type: 'bedroom',
    url: makeSampleDataUrl('Studio Bedroom', 'Master bed, nightstands & study desk', ['#833471', '#4b134f'], '🛏️'),
  },
]

type PhotoTo3DDialogProps = {
  onConverted: (graph: SceneGraph) => void
  disabled?: boolean
}

export function PhotoTo3DDialog({ onConverted, disabled = false }: PhotoTo3DDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFileName, setImageFileName] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [roomNameInput, setRoomNameInput] = useState<string>('')
  const [converting, setConverting] = useState(false)
  const [conversionStage, setConversionStage] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<SceneGraph | null>(null)
  const [exportingGlb, setExportingGlb] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  function openModal() {
    setError(null)
    setLastResult(null)
    dialog.current?.showModal()
  }

  function closeModal() {
    dialog.current?.close()
  }

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, or WebP).')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Image must be under 10 MB in size.')
      return
    }

    setError(null)
    setImageFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setImagePreview(dataUrl)
      if (!roomNameInput) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        setRoomNameInput(cleanName.charAt(0).toUpperCase() + cleanName.slice(1))
      }
    }
    reader.onerror = () => {
      setError('Could not read image file.')
    }
    reader.readAsDataURL(file)
  }

  function onFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) handleFile(file)
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function onDragLeave() {
    setIsDragOver(false)
  }

  function useSamplePhoto(sample: typeof SAMPLE_PHOTOS[number]) {
    setError(null)
    setImagePreview(sample.url)
    setImageFileName(`${sample.name}.svg`)
    setSelectedType(sample.type)
    setRoomNameInput(sample.name)
  }

  function clearImage() {
    setImagePreview(null)
    setImageFileName('')
    setLastResult(null)
    setError(null)
  }

  async function convertPhoto() {
    if (!imagePreview) return
    setError(null)
    setConverting(true)
    setConversionStage('Analyzing 2D photo spatial perspective…')

    try {
      const progressTimer1 = setTimeout(() => {
        setConversionStage('Detecting room boundaries, depth & walls…')
      }, 700)
      const progressTimer2 = setTimeout(() => {
        setConversionStage('Matching furniture to GeoVision-AI 3D library…')
      }, 1500)

      const result = await sceneFromImage(
        imagePreview,
        selectedType || undefined,
        roomNameInput.trim() || undefined,
      )

      clearTimeout(progressTimer1)
      clearTimeout(progressTimer2)
      setConversionStage('Generating 3D digital twin room…')

      setLastResult(result)
      onConverted(result)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Photo-to-3D conversion failed. Check backend connection.')
    } finally {
      setConverting(false)
      setConversionStage('')
    }
  }

  async function handleDownloadGlb() {
    if (!lastResult) return
    setExportingGlb(true)
    try {
      const name = exportName(lastResult, 'glb')
      const data = await exportGlb(lastResult)
      downloadFile(name, data as BlobPart, 'model/gltf-binary')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not export .glb file.')
    } finally {
      setExportingGlb(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="chip photo-3d-btn"
        disabled={disabled}
        onClick={openModal}
        title="Convert a 2D room photo to an interactive 3D digital twin"
      >
        <span className="photo-icon" aria-hidden="true">📷</span>
        Photo to 3D
      </button>

      <dialog ref={dialog} className="capture-import photo-to-3d-dialog" aria-labelledby="photo-to-3d-title">
        <div className="capture-import-heading">
          <p className="panel-kicker">Vision AI Twin</p>
          <button type="button" aria-label="Close Photo to 3D" onClick={closeModal}>×</button>
        </div>

        <h2 id="photo-to-3d-title">Convert Room Photo to 3D Twin</h2>
        <p className="photo-3d-subtitle">
          Upload any room photograph (JPG, PNG, WebP) to reconstruct an interactive 3D room with matching furniture models, avatar walk mode, and .glb export.
        </p>

        {/* Drop zone / Image preview */}
        {!imagePreview ? (
          <div
            className={`photo-dropzone ${isDragOver ? 'drag-active' : ''}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
            aria-label="Upload room photograph"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              aria-label="Upload photo file"
              className="visually-hidden"
              onChange={onFileInputChange}
            />

            <div className="dropzone-icon" aria-hidden="true">📸</div>
            <p className="dropzone-title">Drop your room photograph here</p>
            <p className="dropzone-hint">or click to browse from device · JPG, PNG, WebP (up to 10 MB)</p>
          </div>
        ) : (
          <div className="photo-preview-card">
            <div className="preview-image-wrapper">
              <img src={imagePreview} alt="Room upload preview" className="photo-preview-img" />
              <button
                type="button"
                className="preview-remove-btn"
                onClick={clearImage}
                title="Remove photo"
                aria-label="Remove photo"
              >
                ✕
              </button>
            </div>
            <div className="preview-meta">
              <span className="preview-filename">{imageFileName || 'Uploaded Room Photo'}</span>
              <button type="button" className="ghost-button" onClick={() => fileInputRef.current?.click()}>
                Replace photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="visually-hidden"
                onChange={onFileInputChange}
              />
            </div>
          </div>
        )}

        {/* Sample photos for quick test */}
        {!imagePreview && (
          <div className="sample-photos-row">
            <span className="sample-label">Or try a sample photo:</span>
            <div className="sample-btn-group">
              {SAMPLE_PHOTOS.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  className="sample-photo-chip"
                  onClick={() => useSamplePhoto(sample)}
                >
                  {sample.name.replace('Sample ', '')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form controls: Room Type & Custom Name */}
        <div className="photo-3d-controls">
          <div className="control-group">
            <label htmlFor="photo-room-type" className="control-label">
              Room Category / Style:
            </label>
            <select
              id="photo-room-type"
              className="control-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              disabled={converting}
            >
              {ROOM_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label} — {type.hint}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="photo-room-name" className="control-label">
              Room Name (optional):
            </label>
            <input
              id="photo-room-name"
              type="text"
              className="control-input"
              placeholder="e.g. My Living Room, Executive Suite"
              value={roomNameInput}
              onChange={(e) => setRoomNameInput(e.target.value)}
              disabled={converting}
            />
          </div>
        </div>

        {/* AI Processing info callout */}
        <div className="photo-ai-notice">
          <div className="notice-icon" aria-hidden="true">💡</div>
          <div className="notice-content">
            <p>
              <strong>AI Vision & Offline Spatial Engine:</strong> When an <code>OPENAI_API_KEY</code> is configured, OpenAI Vision detects exact room depth and placed items. If offline or no key is present, our heuristic engine creates a calibrated 3D digital twin room.
            </p>
          </div>
        </div>

        {error && <p className="error" role="alert">{error}</p>}

        {/* Progress Bar / Indicator */}
        {converting && (
          <div className="conversion-progress" role="status">
            <div className="progress-spinner" aria-hidden="true" />
            <div className="progress-details">
              <p className="progress-stage">{conversionStage}</p>
              <p className="progress-sub">Building 3D coordinates and placing library assets…</p>
            </div>
          </div>
        )}

        {/* Success Card if conversion just finished */}
        {lastResult && !converting && (
          <div className="conversion-success-card" role="status">
            <div className="success-header">
              <span className="success-check">✓</span>
              <div>
                <h4>{lastResult.room.name} created!</h4>
                <p>
                  Dimensions: {lastResult.room.width} × {lastResult.room.depth} × {lastResult.room.height} m · {lastResult.objects.length} 3D objects placed
                </p>
              </div>
            </div>
            <div className="success-actions">
              <button
                type="button"
                className="chip success-action-btn"
                onClick={closeModal}
              >
                Explore Room in 3D
              </button>
              <button
                type="button"
                className="chip ghost-button success-action-btn"
                disabled={exportingGlb}
                onClick={() => { void handleDownloadGlb() }}
              >
                {exportingGlb ? 'Generating .glb…' : 'Download .GLB Model'}
              </button>
            </div>
          </div>
        )}

        {/* Modal footer actions */}
        <div className="photo-dialog-footer">
          <button
            type="button"
            className="action-button primary-action"
            disabled={!imagePreview || converting}
            onClick={() => { void convertPhoto() }}
          >
            {converting ? 'Converting Room…' : 'Convert to 3D Digital Twin'}
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={closeModal}
            disabled={converting}
          >
            Close
          </button>
        </div>
      </dialog>
    </>
  )
}
