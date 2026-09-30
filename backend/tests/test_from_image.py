from fastapi.testclient import TestClient
from app.main import create_app
from app.services.from_image import heuristic_scene_from_image


def test_heuristic_scene_from_image():
    # Test Living Room
    graph_living = heuristic_scene_from_image(room_type="living room", room_name="Test Living")
    assert graph_living.room.name == "Test Living"
    assert len(graph_living.objects) > 0
    assert any(o.type == "sofa" for o in graph_living.objects)

    # Test Bedroom
    graph_bed = heuristic_scene_from_image(room_type="bedroom", room_name="Test Bedroom")
    assert graph_bed.room.name == "Test Bedroom"
    assert any(o.type == "bed" for o in graph_bed.objects)

    # Test Office
    graph_office = heuristic_scene_from_image(room_type="office conference", room_name="Test Office")
    assert any(o.type == "table" for o in graph_office.objects)


def test_from_image_endpoint():
    app = create_app()
    client = TestClient(app)
    response = client.post(
        "/scene/from-image",
        json={
            "imageBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "roomType": "bedroom",
            "roomName": "My New Bedroom",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "room" in data
    assert "objects" in data
    assert data["room"]["name"] == "My New Bedroom"
    assert len(data["objects"]) > 0
