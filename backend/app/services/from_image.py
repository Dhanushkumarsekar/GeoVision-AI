from __future__ import annotations

import json
import os
import uuid
from typing import Any

from app.models import Room, SceneGraph, SceneObject

KNOWN_ASSETS = [
    "chair_standard",
    "chair_office",
    "stool_round",
    "table_dining",
    "table_side",
    "table_cafe",
    "chair_cafe",
    "stool_bar",
    "sofa_3seat",
    "shelf_open",
    "bookshelf",
    "cabinet_simple",
    "desk_large",
    "plant_indoor_tall",
    "plant_potted_medium",
    "plant_potted_small",
    "pot_empty",
    "trash_bin",
    "laptop",
    "monitor_desktop",
    "counter_cafe",
    "coffee_machine",
    "books_stack",
    "pendant_cafe",
    "track_ceiling",
]


def heuristic_scene_from_image(room_type: str | None = None, room_name: str | None = None) -> SceneGraph:
    normalized_type = (room_type or "").lower().strip()
    scene_id = f"photo-room-{uuid.uuid4().hex[:8]}"

    if "bed" in normalized_type:
        room = Room(id=scene_id, name=room_name or "Cozy Bedroom", width=5.2, depth=4.6, height=2.8)
        objects = [
            # Main bed (represented with sofa_3seat + side tables)
            SceneObject(
                id="bed-main",
                type="bed",
                label="Master bed",
                category="furniture",
                position=[-0.5, 0.45, -1.2],
                size=[2.0, 0.9, 1.8],
                rotation=[0, 0, 0],
                asset_id="sofa_3seat",
                color="#5a6b82",
            ),
            SceneObject(
                id="nightstand-left",
                type="table",
                label="Left nightstand",
                category="furniture",
                position=[-1.8, 0.25, -1.2],
                size=[0.45, 0.5, 0.45],
                rotation=[0, 0, 0],
                asset_id="table_side",
                color="#8c6d48",
            ),
            SceneObject(
                id="nightstand-right",
                type="table",
                label="Right nightstand",
                category="furniture",
                position=[0.8, 0.25, -1.2],
                size=[0.45, 0.5, 0.45],
                rotation=[0, 0, 0],
                asset_id="table_side",
                color="#8c6d48",
            ),
            # Wardrobe / Cabinet
            SceneObject(
                id="wardrobe-1",
                type="cabinet",
                label="Wardrobe storage",
                category="furniture",
                position=[1.9, 0.9, -0.2],
                size=[0.8, 1.8, 0.5],
                rotation=[0, -1.57, 0],
                asset_id="cabinet_simple",
                color="#3d3d3d",
            ),
            # Work study nook
            SceneObject(
                id="study-desk",
                type="table",
                label="Study desk",
                category="furniture",
                position=[-1.2, 0.38, 1.3],
                size=[1.4, 0.75, 0.7],
                rotation=[0, 3.14, 0],
                asset_id="table_dining",
                color="#e5e5e5",
            ),
            SceneObject(
                id="study-chair",
                type="chair",
                label="Desk chair",
                category="furniture",
                position=[-1.2, 0.45, 0.6],
                size=[0.6, 0.9, 0.6],
                rotation=[0, 0, 0],
                asset_id="chair_office",
                color="#222222",
            ),
            SceneObject(
                id="laptop-1",
                type="equipment",
                label="Personal laptop",
                category="equipment",
                position=[-1.2, 0.77, 1.25],
                size=[0.35, 0.2, 0.25],
                rotation=[0, 3.14, 0],
                asset_id="laptop",
            ),
            # Plants and ambience
            SceneObject(
                id="bedroom-plant",
                type="plant",
                label="Corner indoor plant",
                category="furniture",
                position=[1.8, 0.6, 1.5],
                size=[0.5, 1.2, 0.5],
                rotation=[0, 0, 0],
                asset_id="plant_indoor_tall",
            ),
        ]
    elif "office" in normalized_type or "conference" in normalized_type or "board" in normalized_type:
        room = Room(id=scene_id, name=room_name or "Modern Executive Boardroom", width=6.8, depth=5.2, height=3.0)
        objects = [
            # Main Conference Table
            SceneObject(
                id="conf-table",
                type="table",
                label="Conference table",
                category="furniture",
                position=[0.0, 0.38, 0.0],
                size=[2.6, 0.75, 1.2],
                rotation=[0, 0, 0],
                asset_id="table_dining",
                color="#2f3542",
            ),
            # Chairs around table
            SceneObject(
                id="conf-chair-1",
                type="chair",
                label="Executive chair · North 1",
                category="furniture",
                position=[-0.7, 0.45, -0.9],
                size=[0.6, 0.9, 0.6],
                rotation=[0, 0, 0],
                asset_id="chair_office",
            ),
            SceneObject(
                id="conf-chair-2",
                type="chair",
                label="Executive chair · North 2",
                category="furniture",
                position=[0.7, 0.45, -0.9],
                size=[0.6, 0.9, 0.6],
                rotation=[0, 0, 0],
                asset_id="chair_office",
            ),
            SceneObject(
                id="conf-chair-3",
                type="chair",
                label="Executive chair · South 1",
                category="furniture",
                position=[-0.7, 0.45, 0.9],
                size=[0.6, 0.9, 0.6],
                rotation=[0, 3.14, 0],
                asset_id="chair_office",
            ),
            SceneObject(
                id="conf-chair-4",
                type="chair",
                label="Executive chair · South 2",
                category="furniture",
                position=[0.7, 0.45, 0.9],
                size=[0.6, 0.9, 0.6],
                rotation=[0, 3.14, 0],
                asset_id="chair_office",
            ),
            SceneObject(
                id="conf-chair-5",
                type="chair",
                label="Executive chair · West Head",
                category="furniture",
                position=[-1.6, 0.45, 0.0],
                size=[0.6, 0.9, 0.6],
                rotation=[0, 1.57, 0],
                asset_id="chair_office",
            ),
            SceneObject(
                id="conf-chair-6",
                type="chair",
                label="Executive chair · East Foot",
                category="furniture",
                position=[1.6, 0.45, 0.0],
                size=[0.6, 0.9, 0.6],
                rotation=[0, -1.57, 0],
                asset_id="chair_office",
            ),
            # Credenza / Presentation screen
            SceneObject(
                id="credenza",
                type="cabinet",
                label="Media credenza",
                category="furniture",
                position=[0.0, 0.4, -2.1],
                size=[1.8, 0.7, 0.45],
                rotation=[0, 0, 0],
                asset_id="cabinet_simple",
                color="#1e272e",
            ),
            SceneObject(
                id="display-screen",
                type="equipment",
                label="Conference display screen",
                category="equipment",
                position=[0.0, 1.4, -2.2],
                size=[1.6, 0.9, 0.1],
                rotation=[0, 0, 0],
                asset_id="monitor_desktop",
            ),
            # Greenery
            SceneObject(
                id="office-plant-1",
                type="plant",
                label="Corner ficus",
                category="furniture",
                position=[-2.8, 0.6, -1.9],
                size=[0.5, 1.3, 0.5],
                rotation=[0, 0, 0],
                asset_id="plant_indoor_tall",
            ),
            SceneObject(
                id="office-plant-2",
                type="plant",
                label="Side plant",
                category="furniture",
                position=[2.8, 0.6, 1.8],
                size=[0.5, 1.2, 0.5],
                rotation=[0, 0, 0],
                asset_id="plant_indoor_tall",
            ),
        ]
    elif "dining" in normalized_type or "kitchen" in normalized_type:
        room = Room(id=scene_id, name=room_name or "Modern Dining Room", width=5.6, depth=5.0, height=2.9)
        objects = [
            SceneObject(
                id="dining-table",
                type="table",
                label="Central dining table",
                category="furniture",
                position=[0.0, 0.38, 0.2],
                size=[1.8, 0.75, 0.9],
                rotation=[0, 0, 0],
                asset_id="table_dining",
                color="#b8860b",
            ),
            SceneObject(
                id="dining-chair-1",
                type="chair",
                label="Dining chair 1",
                category="furniture",
                position=[-0.5, 0.44, -0.55],
                size=[0.46, 0.88, 0.46],
                rotation=[0, 0, 0],
                asset_id="chair_standard",
            ),
            SceneObject(
                id="dining-chair-2",
                type="chair",
                label="Dining chair 2",
                category="furniture",
                position=[0.5, 0.44, -0.55],
                size=[0.46, 0.88, 0.46],
                rotation=[0, 0, 0],
                asset_id="chair_standard",
            ),
            SceneObject(
                id="dining-chair-3",
                type="chair",
                label="Dining chair 3",
                category="furniture",
                position=[-0.5, 0.44, 0.95],
                size=[0.46, 0.88, 0.46],
                rotation=[0, 3.14, 0],
                asset_id="chair_standard",
            ),
            SceneObject(
                id="dining-chair-4",
                type="chair",
                label="Dining chair 4",
                category="furniture",
                position=[0.5, 0.44, 0.95],
                size=[0.46, 0.88, 0.46],
                rotation=[0, 3.14, 0],
                asset_id="chair_standard",
            ),
            SceneObject(
                id="sideboard",
                type="cabinet",
                label="Dining buffet sideboard",
                category="furniture",
                position=[0.0, 0.45, -2.0],
                size=[1.6, 0.85, 0.45],
                rotation=[0, 0, 0],
                asset_id="cabinet_simple",
                color="#574b90",
            ),
            SceneObject(
                id="pendant-light",
                type="equipment",
                label="Pendant dining chandelier",
                category="equipment",
                position=[0.0, 2.1, 0.2],
                size=[0.4, 0.6, 0.4],
                rotation=[0, 0, 0],
                asset_id="pendant_cafe",
            ),
            SceneObject(
                id="dining-plant",
                type="plant",
                label="Indoor olive tree",
                category="furniture",
                position=[2.1, 0.6, -1.8],
                size=[0.5, 1.4, 0.5],
                rotation=[0, 0, 0],
                asset_id="plant_indoor_tall",
            ),
        ]
    else:
        # Default: Cozy Living Room & Lounge
        room = Room(id=scene_id, name=room_name or "Cozy Living Room & Lounge", width=6.0, depth=5.4, height=2.9)
        objects = [
            # Main 3-seat sofa
            SceneObject(
                id="sofa-main",
                type="sofa",
                label="3-Seat comfort sofa",
                category="furniture",
                position=[0.0, 0.45, -1.3],
                size=[2.2, 0.85, 0.9],
                rotation=[0, 0, 0],
                asset_id="sofa_3seat",
                color="#3c6382",
            ),
            # Coffee table in front of sofa
            SceneObject(
                id="coffee-table",
                type="table",
                label="Central coffee table",
                category="furniture",
                position=[0.0, 0.22, -0.1],
                size=[1.1, 0.45, 0.65],
                rotation=[0, 0, 0],
                asset_id="table_side",
                color="#82589f",
            ),
            # Armchairs
            SceneObject(
                id="armchair-left",
                type="chair",
                label="Lounge chair · Left",
                category="furniture",
                position=[-1.6, 0.4, -0.4],
                size=[0.8, 0.8, 0.8],
                rotation=[0, 0.85, 0],
                asset_id="chair_cafe",
            ),
            SceneObject(
                id="armchair-right",
                type="chair",
                label="Lounge chair · Right",
                category="furniture",
                position=[1.6, 0.4, -0.4],
                size=[0.8, 0.8, 0.8],
                rotation=[0, -0.85, 0],
                asset_id="chair_cafe",
            ),
            # Media unit & TV
            SceneObject(
                id="tv-console",
                type="cabinet",
                label="Media TV console",
                category="furniture",
                position=[0.0, 0.35, 2.1],
                size=[1.8, 0.5, 0.45],
                rotation=[0, 3.14, 0],
                asset_id="cabinet_simple",
                color="#2c3e50",
            ),
            SceneObject(
                id="living-tv",
                type="equipment",
                label="Widescreen television",
                category="equipment",
                position=[0.0, 1.0, 2.1],
                size=[1.4, 0.8, 0.1],
                rotation=[0, 3.14, 0],
                asset_id="monitor_desktop",
            ),
            # Bookshelf along side wall
            SceneObject(
                id="bookshelf-wall",
                type="bookshelf",
                label="Living room library bookshelf",
                category="furniture",
                position=[-2.5, 0.9, 0.8],
                size=[0.8, 1.8, 0.35],
                rotation=[0, 1.57, 0],
                asset_id="bookshelf",
            ),
            # Tall plant
            SceneObject(
                id="living-plant",
                type="plant",
                label="Corner monstera plant",
                category="furniture",
                position=[2.4, 0.6, -1.9],
                size=[0.5, 1.3, 0.5],
                rotation=[0, 0, 0],
                asset_id="plant_indoor_tall",
            ),
        ]

    return SceneGraph(source="simulated", room=room, objects=objects)


def scene_from_image(image_base64: str, room_type: str | None = None, room_name: str | None = None) -> SceneGraph:
    key = os.getenv("OPENAI_API_KEY", "").strip()
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini").strip() or "gpt-4o-mini"
    base_url = os.getenv("OPENAI_BASE_URL", "").strip() or None

    if key.startswith("sk-") and "your-openai-api-key" not in key and image_base64:
        try:
            from openai import OpenAI

            client = OpenAI(api_key=key, base_url=base_url)

            # Ensure image_base64 is clean data URL or prefix
            if not image_base64.startswith("data:image/"):
                formatted_image = f"data:image/jpeg;base64,{image_base64}"
            else:
                formatted_image = image_base64

            assets_str = ", ".join(KNOWN_ASSETS)
            system_prompt = (
                "You are GeoVision-AI's computer vision 3D room reconstructor. "
                "Analyze the uploaded room photograph and reconstruct its 3D spatial layout. "
                "Output a single JSON object with this exact structure:\n"
                "{\n"
                '  "room": {\n'
                '    "id": "room-ai-1",\n'
                '    "name": "string",\n'
                '    "width": float (in meters, e.g. 5.5),\n'
                '    "depth": float (in meters, e.g. 4.8),\n'
                '    "height": float (in meters, e.g. 2.8),\n'
                '    "units": "m"\n'
                "  },\n"
                '  "objects": [\n'
                "    {\n"
                '      "id": "unique-id-1",\n'
                '      "type": "chair|table|sofa|bed|cabinet|plant|equipment|bookshelf",\n'
                '      "label": "descriptive label",\n'
                '      "category": "furniture|equipment|structure",\n'
                '      "position": [x, y, z] (in meters, origin at room center floor, y is height above floor),\n'
                '      "size": [width, height, depth] (in meters),\n'
                '      "rotation": [rx, ry, rz] (radians, typically [0, angle, 0]),\n'
                f'      "assetId": "one of: {assets_str}",\n'
                '      "color": "hex color string like #3d5a80"\n'
                "    }\n"
                "  ]\n"
                "}\n"
                "Keep objects physically realistic inside the room boundaries. "
                "Choose the closest matching assetId for each detected furniture object."
            )

            response = client.chat.completions.create(
                model=model,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": f"Analyze this room photo ({room_type or 'auto-detect room type'}). Reconstruct it as an accurate 3D GeoVision-AI scene.",
                            },
                            {
                                "type": "image_url",
                                "image_url": {"url": formatted_image, "detail": "low"},
                            },
                        ],
                    },
                ],
                max_tokens=2000,
            )

            raw_text = response.choices[0].message.content or "{}"
            data = json.loads(raw_text)

            room_data = data.get("room", {})
            room = Room(
                id=str(room_data.get("id", f"ai-room-{uuid.uuid4().hex[:6]}")),
                name=str(room_data.get("name", room_name or "AI Reconstructed Room")),
                width=float(room_data.get("width", 6.0)),
                depth=float(room_data.get("depth", 5.0)),
                height=float(room_data.get("height", 2.8)),
                units="m",
            )

            raw_objects = data.get("objects", [])
            parsed_objects: list[SceneObject] = []
            for idx, raw_obj in enumerate(raw_objects):
                if not isinstance(raw_obj, dict):
                    continue
                pos = raw_obj.get("position", [0.0, 0.0, 0.0])
                sz = raw_obj.get("size", [0.8, 0.8, 0.8])
                rot = raw_obj.get("rotation", [0.0, 0.0, 0.0])

                asset_id = raw_obj.get("assetId") or raw_obj.get("asset_id")
                if asset_id not in KNOWN_ASSETS:
                    # fallback to category match
                    t = str(raw_obj.get("type", "")).lower()
                    if "chair" in t:
                        asset_id = "chair_standard"
                    elif "table" in t or "desk" in t:
                        asset_id = "table_dining"
                    elif "sofa" in t or "couch" in t:
                        asset_id = "sofa_3seat"
                    elif "plant" in t:
                        asset_id = "plant_indoor_tall"
                    elif "book" in t or "shelf" in t:
                        asset_id = "bookshelf"
                    else:
                        asset_id = "table_side"

                parsed_objects.append(
                    SceneObject(
                        id=str(raw_obj.get("id", f"obj-{idx+1}")),
                        type=str(raw_obj.get("type", "furniture")),
                        label=str(raw_obj.get("label", f"Object {idx+1}")),
                        category=raw_obj.get("category", "furniture"),
                        position=(float(pos[0]), float(pos[1]), float(pos[2])),
                        size=(float(sz[0]), float(sz[1]), float(sz[2])),
                        rotation=(float(rot[0]), float(rot[1]), float(rot[2])) if rot else None,
                        asset_id=asset_id,
                        color=raw_obj.get("color"),
                    )
                )

            if parsed_objects:
                return SceneGraph(source="simulated", room=room, objects=parsed_objects)
        except Exception:
            # Fallback smoothly to heuristic generation if API error occurs
            pass

    return heuristic_scene_from_image(room_type=room_type, room_name=room_name)
