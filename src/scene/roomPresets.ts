import type { SceneGraph, SceneObject } from './types'
import { parseCapture } from './importCapture'
import { simulatedCaptureJson } from './simulatedCapture'
import cafeSceneRaw from './presets/cafe_scene.json'

export interface RoomPreset {
  id: string
  name: string
  category: 'Lounge' | 'Commercial' | 'Residential'
  description: string
  dimensions: string
  width: number
  depth: number
  height: number
  objectCount: number
  badge?: string
  accentColor: string
  features: string[]
  load: () => SceneGraph
}

function cloneGraph(graph: SceneGraph): SceneGraph {
  return JSON.parse(JSON.stringify(graph)) as SceneGraph
}

// Preset 1: Photo Café Lounge (Default Demo)
const cafePreset: RoomPreset = {
  id: 'preset-cafe',
  name: 'Photo Café Lounge',
  category: 'Lounge',
  description: 'Boutique coffee lounge with conversational café seating, corner reading library, counter espresso bar, and warm ambient pendant lighting.',
  dimensions: '6.4 × 9.6 × 3.4 m',
  width: 6.4,
  depth: 9.6,
  height: 3.4,
  objectCount: (cafeSceneRaw as unknown as SceneGraph).objects.length,
  badge: 'Default Demo',
  accentColor: '#cba778',
  features: ['Conversational café tables', 'Full bookshelf library', 'Espresso bar counter', 'Pendant lighting'],
  load: () => cloneGraph(cafeSceneRaw as unknown as SceneGraph),
}

// Preset 2: Modern Executive Boardroom
function createBoardroomGraph(): SceneGraph {
  const objects: SceneObject[] = [
    // Main boardroom conference table
    {
      id: 'board-table',
      type: 'table',
      label: 'Conference table',
      category: 'furniture',
      position: [0.0, 0.375, 0.0],
      size: [2.8, 0.75, 1.3],
      rotation: [0, 0, 0],
      assetId: 'table_dining',
      color: '#2f3542',
    },
    // Executive office chairs - North row
    {
      id: 'chair-n1',
      type: 'chair',
      label: 'Executive chair · N1',
      category: 'furniture',
      position: [-0.9, 0.45, -0.95],
      size: [0.65, 0.97, 0.59],
      rotation: [0, 0, 0],
      assetId: 'chair_office',
    },
    {
      id: 'chair-n2',
      type: 'chair',
      label: 'Executive chair · N2',
      category: 'furniture',
      position: [0.0, 0.45, -0.95],
      size: [0.65, 0.97, 0.59],
      rotation: [0, 0, 0],
      assetId: 'chair_office',
    },
    {
      id: 'chair-n3',
      type: 'chair',
      label: 'Executive chair · N3',
      category: 'furniture',
      position: [0.9, 0.45, -0.95],
      size: [0.65, 0.97, 0.59],
      rotation: [0, 0, 0],
      assetId: 'chair_office',
    },
    // Executive office chairs - South row
    {
      id: 'chair-s1',
      type: 'chair',
      label: 'Executive chair · S1',
      category: 'furniture',
      position: [-0.9, 0.45, 0.95],
      size: [0.65, 0.97, 0.59],
      rotation: [0, Math.PI, 0],
      assetId: 'chair_office',
    },
    {
      id: 'chair-s2',
      type: 'chair',
      label: 'Executive chair · S2',
      category: 'furniture',
      position: [0.0, 0.45, 0.95],
      size: [0.65, 0.97, 0.59],
      rotation: [0, Math.PI, 0],
      assetId: 'chair_office',
    },
    {
      id: 'chair-s3',
      type: 'chair',
      label: 'Executive chair · S3',
      category: 'furniture',
      position: [0.9, 0.45, 0.95],
      size: [0.65, 0.97, 0.59],
      rotation: [0, Math.PI, 0],
      assetId: 'chair_office',
    },
    // Head of table chairs
    {
      id: 'chair-w',
      type: 'chair',
      label: 'Executive chair · West Head',
      category: 'furniture',
      position: [-1.75, 0.45, 0.0],
      size: [0.65, 0.97, 0.59],
      rotation: [0, Math.PI / 2, 0],
      assetId: 'chair_office',
    },
    {
      id: 'chair-e',
      type: 'chair',
      label: 'Executive chair · East Foot',
      category: 'furniture',
      position: [1.75, 0.45, 0.0],
      size: [0.65, 0.97, 0.59],
      rotation: [0, -Math.PI / 2, 0],
      assetId: 'chair_office',
    },
    // Presentation credenza & Display screen
    {
      id: 'board-credenza',
      type: 'cabinet',
      label: 'Media credenza',
      category: 'furniture',
      position: [0.0, 0.45, -2.15],
      size: [2.0, 0.75, 0.45],
      rotation: [0, 0, 0],
      assetId: 'cabinet_simple',
      color: '#1e272e',
    },
    {
      id: 'board-display',
      type: 'equipment',
      label: 'Presentation display screen',
      category: 'equipment',
      position: [0.0, 1.45, -2.25],
      size: [1.8, 1.0, 0.1],
      rotation: [0, 0, 0],
      assetId: 'monitor_desktop',
    },
    // Table conference equipment
    {
      id: 'table-laptop-1',
      type: 'equipment',
      label: 'Presenter laptop',
      category: 'equipment',
      position: [-0.9, 0.77, 0.1],
      size: [0.35, 0.2, 0.25],
      rotation: [0, 0, 0],
      assetId: 'laptop',
    },
    {
      id: 'table-laptop-2',
      type: 'equipment',
      label: 'Participant laptop',
      category: 'equipment',
      position: [0.9, 0.77, -0.1],
      size: [0.35, 0.2, 0.25],
      rotation: [0, Math.PI, 0],
      assetId: 'laptop',
    },
    // Bookshelves / Document storage
    {
      id: 'board-shelf',
      type: 'bookshelf',
      label: 'Reference library',
      category: 'furniture',
      position: [-3.1, 0.9, 0.0],
      size: [0.8, 1.8, 0.38],
      rotation: [0, Math.PI / 2, 0],
      assetId: 'bookshelf',
    },
    // Plants and ambience
    {
      id: 'board-plant-1',
      type: 'plant',
      label: 'Corner ficus',
      category: 'furniture',
      position: [-2.9, 0.6, -1.9],
      size: [0.5, 1.3, 0.5],
      rotation: [0, 0, 0],
      assetId: 'plant_indoor_tall',
    },
    {
      id: 'board-plant-2',
      type: 'plant',
      label: 'East palm',
      category: 'furniture',
      position: [2.9, 0.6, -1.9],
      size: [0.5, 1.3, 0.5],
      rotation: [0, 0, 0],
      assetId: 'plant_indoor_tall',
    },
    {
      id: 'board-pendant-1',
      type: 'equipment',
      label: 'Conference pendant luminaire',
      category: 'equipment',
      position: [0.0, 2.3, 0.0],
      size: [0.4, 0.6, 0.4],
      rotation: [0, 0, 0],
      assetId: 'pendant_cafe',
    },
    {
      id: 'board-bin',
      type: 'furniture',
      label: 'Recycling bin',
      category: 'furniture',
      position: [2.8, 0.16, 2.0],
      size: [0.28, 0.32, 0.28],
      rotation: [0, 0, 0],
      assetId: 'trash_bin',
    },
  ]

  return {
    source: 'simulated',
    room: {
      id: 'preset-boardroom-7050',
      name: 'Modern Executive Boardroom',
      width: 7.0,
      depth: 5.0,
      height: 3.0,
      units: 'm',
    },
    objects,
  }
}

const boardroomPreset: RoomPreset = {
  id: 'preset-boardroom',
  name: 'Modern Executive Boardroom',
  category: 'Commercial',
  description: 'Executive conference room featuring a large central boardroom table, 8 ergonomic swivel chairs, media credenza, widescreen presentation screen, and architectural greenery.',
  dimensions: '7.0 × 5.0 × 3.0 m',
  width: 7.0,
  depth: 5.0,
  height: 3.0,
  objectCount: 18,
  badge: 'Executive',
  accentColor: '#3ee0c2',
  features: ['8-seat conference table', 'Widescreen presentation display', 'Media credenza', 'Corner architectural plants'],
  load: createBoardroomGraph,
}

// Preset 3: Cozy Living Room & Lounge
function createLivingRoomGraph(): SceneGraph {
  const objects: SceneObject[] = [
    // 3-seat sofa
    {
      id: 'sofa-main',
      type: 'sofa',
      label: '3-Seat comfort sofa',
      category: 'furniture',
      position: [0.0, 0.43, -1.3],
      size: [2.18, 0.86, 0.86],
      rotation: [0, 0, 0],
      assetId: 'sofa_3seat',
      color: '#3c6382',
    },
    // Coffee table
    {
      id: 'coffee-table',
      type: 'table',
      label: 'Central coffee table',
      category: 'furniture',
      position: [0.0, 0.25, -0.1],
      size: [1.1, 0.5, 0.6],
      rotation: [0, 0, 0],
      assetId: 'table_side',
      color: '#82589f',
    },
    // Armchairs
    {
      id: 'armchair-left',
      type: 'chair',
      label: 'Lounge chair · Left',
      category: 'furniture',
      position: [-1.6, 0.44, -0.4],
      size: [0.65, 0.88, 0.65],
      rotation: [0, 0.8, 0],
      assetId: 'chair_cafe',
    },
    {
      id: 'armchair-right',
      type: 'chair',
      label: 'Lounge chair · Right',
      category: 'furniture',
      position: [1.6, 0.44, -0.4],
      size: [0.65, 0.88, 0.65],
      rotation: [0, -0.8, 0],
      assetId: 'chair_cafe',
    },
    // Media console & TV
    {
      id: 'tv-console',
      type: 'cabinet',
      label: 'Media TV console',
      category: 'furniture',
      position: [0.0, 0.4, 2.05],
      size: [1.8, 0.6, 0.45],
      rotation: [0, Math.PI, 0],
      assetId: 'cabinet_simple',
      color: '#2c3e50',
    },
    {
      id: 'living-tv',
      type: 'equipment',
      label: 'Widescreen television',
      category: 'equipment',
      position: [0.0, 1.15, 2.05],
      size: [1.5, 0.85, 0.1],
      rotation: [0, Math.PI, 0],
      assetId: 'monitor_desktop',
    },
    // Side tables with small plants
    {
      id: 'side-table-left',
      type: 'table',
      label: 'Sofa side table',
      category: 'furniture',
      position: [-1.6, 0.25, -1.3],
      size: [0.45, 0.5, 0.45],
      rotation: [0, 0, 0],
      assetId: 'table_side',
      color: '#4b4b4b',
    },
    {
      id: 'side-plant-1',
      type: 'plant',
      label: 'Table succulent',
      category: 'furniture',
      position: [-1.6, 0.55, -1.3],
      size: [0.25, 0.35, 0.25],
      rotation: [0, 0, 0],
      assetId: 'plant_potted_small',
    },
    // Bookshelves along walls
    {
      id: 'living-bookshelf-1',
      type: 'bookshelf',
      label: 'Living room bookshelf',
      category: 'furniture',
      position: [-2.6, 0.9, 0.8],
      size: [0.8, 1.8, 0.38],
      rotation: [0, Math.PI / 2, 0],
      assetId: 'bookshelf',
    },
    {
      id: 'living-shelf-2',
      type: 'shelf',
      label: 'Open display shelf',
      category: 'furniture',
      position: [-2.6, 0.9, 1.7],
      size: [0.8, 1.8, 0.38],
      rotation: [0, Math.PI / 2, 0],
      assetId: 'shelf_open',
    },
    // Plants
    {
      id: 'living-monstera',
      type: 'plant',
      label: 'Corner monstera plant',
      category: 'furniture',
      position: [2.4, 0.6, -1.9],
      size: [0.5, 1.3, 0.5],
      rotation: [0, 0, 0],
      assetId: 'plant_indoor_tall',
    },
    {
      id: 'living-palm',
      type: 'plant',
      label: 'Foyer indoor palm',
      category: 'furniture',
      position: [2.4, 0.6, 1.8],
      size: [0.5, 1.2, 0.5],
      rotation: [0, 0, 0],
      assetId: 'plant_indoor_tall',
    },
    // Lighting
    {
      id: 'living-pendant',
      type: 'equipment',
      label: 'Warm lounge pendant',
      category: 'equipment',
      position: [0.0, 2.2, 0.0],
      size: [0.4, 0.6, 0.4],
      rotation: [0, 0, 0],
      assetId: 'pendant_cafe',
    },
    // Floor lamp
    {
      id: 'living-lamp',
      type: 'equipment',
      label: 'Reading floor lamp',
      category: 'equipment',
      position: [1.6, 0.8, -1.3],
      size: [0.45, 1.6, 0.45],
      rotation: [0, 0, 0],
      assetId: 'lamp_floor',
    },
    // Waste bin
    {
      id: 'living-bin',
      type: 'furniture',
      label: 'Lounge waste bin',
      category: 'furniture',
      position: [-2.5, 0.16, -1.9],
      size: [0.28, 0.32, 0.28],
      rotation: [0, 0, 0],
      assetId: 'trash_bin',
    },
  ]

  return {
    source: 'simulated',
    room: {
      id: 'preset-living-6050',
      name: 'Cozy Living Room & Lounge',
      width: 6.0,
      depth: 5.0,
      height: 2.9,
      units: 'm',
    },
    objects,
  }
}

const livingRoomPreset: RoomPreset = {
  id: 'preset-living',
  name: 'Cozy Living Room & Lounge',
  category: 'Residential',
  description: 'Relaxed contemporary living room with a 3-seat sofa, twin accent armchairs, coffee table, entertainment media TV console, curated bookshelves, and lush houseplants.',
  dimensions: '6.0 × 5.0 × 2.9 m',
  width: 6.0,
  depth: 5.0,
  height: 2.9,
  objectCount: 15,
  badge: 'Residential',
  accentColor: '#e056fd',
  features: ['3-seat fabric sofa', 'Widescreen media entertainment', 'Open display bookshelves', 'Twin reading armchairs'],
  load: createLivingRoomGraph,
}

// Preset 4: Minimalist Studio Bedroom
function createBedroomGraph(): SceneGraph {
  const objects: SceneObject[] = [
    // Main Bed Lounge
    {
      id: 'bed-main',
      type: 'bed',
      label: 'Studio queen bed',
      category: 'furniture',
      position: [-0.6, 0.45, -1.2],
      size: [2.18, 0.86, 1.8],
      rotation: [0, 0, 0],
      assetId: 'sofa_3seat',
      color: '#5a6b82',
    },
    // Nightstands
    {
      id: 'nightstand-left',
      type: 'table',
      label: 'Left nightstand',
      category: 'furniture',
      position: [-1.95, 0.25, -1.2],
      size: [0.45, 0.5, 0.45],
      rotation: [0, 0, 0],
      assetId: 'table_side',
      color: '#8c6d48',
    },
    {
      id: 'nightstand-right',
      type: 'table',
      label: 'Right nightstand',
      category: 'furniture',
      position: [0.75, 0.25, -1.2],
      size: [0.45, 0.5, 0.45],
      rotation: [0, 0, 0],
      assetId: 'table_side',
      color: '#8c6d48',
    },
    {
      id: 'bed-lamp',
      type: 'equipment',
      label: 'Bedside lamp',
      category: 'equipment',
      position: [-1.95, 0.65, -1.2],
      size: [0.25, 0.4, 0.25],
      rotation: [0, 0, 0],
      assetId: 'plant_potted_small',
    },
    // Wardrobe Cabinet
    {
      id: 'bedroom-wardrobe',
      type: 'cabinet',
      label: 'Wardrobe storage cabinet',
      category: 'furniture',
      position: [2.15, 0.9, -0.4],
      size: [0.8, 1.8, 0.5],
      rotation: [0, -Math.PI / 2, 0],
      assetId: 'cabinet_simple',
      color: '#3d3d3d',
    },
    // Study Work Desk
    {
      id: 'study-desk',
      type: 'table',
      label: 'Work study desk',
      category: 'furniture',
      position: [-1.0, 0.375, 1.3],
      size: [1.4, 0.75, 0.8],
      rotation: [0, Math.PI, 0],
      assetId: 'table_dining',
      color: '#e5e5e5',
    },
    // Office chair at desk
    {
      id: 'study-chair',
      type: 'chair',
      label: 'Desk office chair',
      category: 'furniture',
      position: [-1.0, 0.45, 0.6],
      size: [0.65, 0.97, 0.59],
      rotation: [0, 0, 0],
      assetId: 'chair_office',
    },
    // Work tech on desk
    {
      id: 'study-laptop',
      type: 'equipment',
      label: 'Work laptop',
      category: 'equipment',
      position: [-1.0, 0.77, 1.25],
      size: [0.35, 0.2, 0.25],
      rotation: [0, Math.PI, 0],
      assetId: 'laptop',
    },
    {
      id: 'study-monitor',
      type: 'equipment',
      label: 'External desk monitor',
      category: 'equipment',
      position: [-0.5, 0.98, 1.4],
      size: [0.58, 0.48, 0.2],
      rotation: [0, Math.PI, 0],
      assetId: 'monitor_desktop',
    },
    // Bookshelf
    {
      id: 'bedroom-shelf',
      type: 'bookshelf',
      label: 'Corner bookshelf',
      category: 'furniture',
      position: [2.15, 0.9, 1.1],
      size: [0.8, 1.8, 0.38],
      rotation: [0, -Math.PI / 2, 0],
      assetId: 'bookshelf',
    },
    // Indoor plants
    {
      id: 'bedroom-plant',
      type: 'plant',
      label: 'Corner tall plant',
      category: 'furniture',
      position: [1.8, 0.6, 1.7],
      size: [0.5, 1.2, 0.5],
      rotation: [0, 0, 0],
      assetId: 'plant_indoor_tall',
    },
    // Pendant light
    {
      id: 'bedroom-pendant',
      type: 'equipment',
      label: 'Ceiling pendant',
      category: 'equipment',
      position: [0.0, 2.1, 0.0],
      size: [0.4, 0.6, 0.4],
      rotation: [0, 0, 0],
      assetId: 'pendant_cafe',
    },
    // Trash bin
    {
      id: 'study-bin',
      type: 'furniture',
      label: 'Desk waste bin',
      category: 'furniture',
      position: [-2.0, 0.16, 1.3],
      size: [0.28, 0.32, 0.28],
      rotation: [0, 0, 0],
      assetId: 'trash_bin',
    },
  ]

  return {
    source: 'simulated',
    room: {
      id: 'preset-bedroom-5545',
      name: 'Minimalist Studio Bedroom',
      width: 5.5,
      depth: 4.5,
      height: 2.8,
      units: 'm',
    },
    objects,
  }
}

const bedroomPreset: RoomPreset = {
  id: 'preset-bedroom',
  name: 'Minimalist Studio Bedroom',
  category: 'Residential',
  description: 'Smart urban studio bedroom with master bed lounge, nightstands, wardrobe closet, study workstation with laptop and external monitor, and bookshelf.',
  dimensions: '5.5 × 4.5 × 2.8 m',
  width: 5.5,
  depth: 4.5,
  height: 2.8,
  objectCount: 13,
  badge: 'Studio',
  accentColor: '#f0932b',
  features: ['Master bed lounge', 'Work-from-home study desk', 'Wardrobe storage', 'Dual nightstands'],
  load: createBedroomGraph,
}

// Preset 5: Open-Plan Office Floor (106 objects, 18.0 × 11.6 m)
function createOfficeFloorGraph(): SceneGraph {
  const captureGraph = parseCapture(simulatedCaptureJson())
  // Return with simulated source and all 106 objects ready for twin view
  return {
    ...captureGraph,
    source: 'simulated',
  }
}

const officeFloorPreset: RoomPreset = {
  id: 'preset-office',
  name: 'Open-Plan Office Floor',
  category: 'Commercial',
  description: 'Sprawling 18-metre commercial workspace featuring 12 computer workstation pods, collaborative sofa lounge, executive conference area, document storage, and floor-to-ceiling windows.',
  dimensions: '18.0 × 11.6 × 3.1 m',
  width: 18.0,
  depth: 11.6,
  height: 3.1,
  objectCount: 106,
  badge: 'Large Scale',
  accentColor: '#48dbfb',
  features: ['12 workstation pods', 'Collaborative sofa lounge', 'Perimeter windows & doors', '106 interactive objects'],
  load: createOfficeFloorGraph,
}

export const ROOM_PRESETS: RoomPreset[] = [
  cafePreset,
  boardroomPreset,
  livingRoomPreset,
  bedroomPreset,
  officeFloorPreset,
]

export function getPresetById(id: string): RoomPreset | undefined {
  return ROOM_PRESETS.find((preset) => preset.id === id)
}
