import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PhotoTo3DDialog } from './PhotoTo3DDialog'
import { sampleGraph } from '../test/sampleGraph'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PhotoTo3DDialog', () => {
  it('opens dialog on clicking Photo to 3D', async () => {
    const user = userEvent.setup()
    const onConverted = vi.fn()
    render(<PhotoTo3DDialog onConverted={onConverted} />)

    const trigger = screen.getByRole('button', { name: /Photo to 3D/i })
    expect(trigger).toBeEnabled()
    await user.click(trigger)

    expect(screen.getByRole('heading', { name: /Convert Room Photo to 3D Twin/i })).toBeInTheDocument()
    expect(screen.getByText(/Upload any room photograph/i)).toBeInTheDocument()
  })

  it('allows selecting a sample photo and converting to 3D', async () => {
    const user = userEvent.setup()
    const onConverted = vi.fn()

    // Mock fetch for /scene/from-image
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => sampleGraph,
      text: async () => JSON.stringify(sampleGraph),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<PhotoTo3DDialog onConverted={onConverted} />)
    await user.click(screen.getByRole('button', { name: /Photo to 3D/i }))

    // Click sample photo
    const sampleBtn = screen.getByRole('button', { name: 'Living Room' })
    await user.click(sampleBtn)

    // Convert button should now be enabled
    const convertBtn = screen.getByRole('button', { name: /Convert to 3D Digital Twin/i })
    expect(convertBtn).toBeEnabled()
    await user.click(convertBtn)

    expect(fetchMock).toHaveBeenCalledWith(
      '/scene/from-image',
      expect.objectContaining({
        method: 'POST',
      }),
    )

    expect(await screen.findByText(/created!/i)).toBeInTheDocument()
    expect(onConverted).toHaveBeenCalledWith(sampleGraph)
  })

  it('validates file upload format', async () => {
    const user = userEvent.setup()
    const onConverted = vi.fn()
    render(<PhotoTo3DDialog onConverted={onConverted} />)

    await user.click(screen.getByRole('button', { name: /Photo to 3D/i }))

    const fileInput = screen.getByLabelText('Upload photo file')
    const textFile = new File(['hello'], 'test.txt', { type: 'text/plain' })
    fireEvent.change(fileInput, { target: { files: [textFile] } })

    expect(screen.getByRole('alert')).toHaveTextContent(/Please choose an image file/i)
    expect(onConverted).not.toHaveBeenCalled()
  })


})
