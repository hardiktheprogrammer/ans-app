import { mockFunction, renderHook } from '@app/test-utils'

import { useEns } from '@app/utils/EnsProvider'

import { usePrimary } from './usePrimary'

jest.mock('@app/utils/EnsProvider')

const mockUseEns = mockFunction(useEns)

const mockGetName = jest.fn()

describe('usePrimary', () => {
  mockUseEns.mockReturnValue({
    ready: true,
    getName: mockGetName,
  })
  it('should return a name if name is returned and matches', async () => {
    mockGetName.mockResolvedValue({
      name: 'test.arb',
      match: true,
    })

    const { result, waitForNextUpdate } = renderHook(() => usePrimary('0x123'))
    await waitForNextUpdate()
    expect(result.current.name).toBe('test.arb')
  })
  it("should return null if name doesn't match", async () => {
    mockGetName.mockResolvedValue({
      name: 'test.arb',
      match: false,
    })

    const { result, waitForNextUpdate } = renderHook(() => usePrimary('0x123'))
    await waitForNextUpdate()
    expect(result.current.name).toBe(null)
  })
})
