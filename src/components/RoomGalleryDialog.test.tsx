import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RoomGalleryDialog } from './RoomGalleryDialog'

describe('RoomGalleryDialog', () => {
  it('opens room gallery dialog', async () => {
    const user = userEvent.setup()
    const onSelectRoom = vi.fn()
    render(<RoomGalleryDialog onSelectRoom={onSelectRoom} />)

    const trigger = screen.getByRole('button', { name: /Room Gallery/i })
    expect(trigger).toBeEnabled()
    await user.click(trigger)

    expect(screen.getByRole('heading', { name: /Preset 3D Rooms Gallery/i })).toBeInTheDocument()
    expect(screen.getByText(/Photo Café Lounge/i)).toBeInTheDocument()
    expect(screen.getByText(/Modern Executive Boardroom/i)).toBeInTheDocument()
    expect(screen.getByText(/Cozy Living Room & Lounge/i)).toBeInTheDocument()
    expect(screen.getByText(/Minimalist Studio Bedroom/i)).toBeInTheDocument()
    expect(screen.getByText(/Open-Plan Office Floor/i)).toBeInTheDocument()
  })

  it('selects a preset room and invokes callback with SceneGraph', async () => {
    const user = userEvent.setup()
    const onSelectRoom = vi.fn()
    render(<RoomGalleryDialog onSelectRoom={onSelectRoom} />)

    await user.click(screen.getByRole('button', { name: /Room Gallery/i }))

    const boardroomCard = screen.getByLabelText(/Load Modern Executive Boardroom/i)
    await user.click(boardroomCard)

    expect(onSelectRoom).toHaveBeenCalledTimes(1)
    const selected = onSelectRoom.mock.calls[0][0]
    expect(selected.room.name).toBe('Modern Executive Boardroom')
    expect(selected.objects.length).toBeGreaterThan(10)
  })

  it('filters presets by category', async () => {
    const user = userEvent.setup()
    const onSelectRoom = vi.fn()
    render(<RoomGalleryDialog onSelectRoom={onSelectRoom} />)

    await user.click(screen.getByRole('button', { name: /Room Gallery/i }))

    // Filter to Residential
    await user.click(screen.getByRole('button', { name: 'Residential' }))

    expect(screen.getByText(/Cozy Living Room & Lounge/i)).toBeInTheDocument()
    expect(screen.getByText(/Minimalist Studio Bedroom/i)).toBeInTheDocument()
    expect(screen.queryByText(/Photo Café Lounge/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Modern Executive Boardroom/i)).not.toBeInTheDocument()
  })
})
