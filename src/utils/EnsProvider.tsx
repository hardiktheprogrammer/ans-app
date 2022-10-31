import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useProvider } from 'wagmi'

import { ANS } from '@ansdomain/ensjs'
import type { ContractName } from '@ansdomain/ensjs/contracts/types'

const opts: ConstructorParameters<typeof ANS>[0] = {}

if (process.env.NEXT_PUBLIC_PROVIDER && process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES) {
  const deploymentAddresses = JSON.parse(process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES!) as Record<
    ContractName | 'ANSRegistry',
    string
  >
  opts.getContractAddress = () => (contractName) =>
    deploymentAddresses[contractName === 'ANSRegistryWithFallback' ? 'ANSRegistry' : contractName]
}

if (process.env.NEXT_PUBLIC_GRAPH_URI) {
  opts.graphURI = process.env.NEXT_PUBLIC_GRAPH_URI
}

const defaultValue: ANS = new ANS(opts)

const EnsContext = createContext({ ...defaultValue, ready: false })

const EnsProvider = ({ children }: { children: React.ReactNode }) => {
  const provider = useProvider()
  const ensWithCurrentProvider = useMemo(() => defaultValue, [])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(false)
    ensWithCurrentProvider.setProvider(provider as any).then(() => setReady(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider])

  return (
    <EnsContext.Provider
      value={useMemo(() => ({ ...ensWithCurrentProvider, ready }), [ensWithCurrentProvider, ready])}
    >
      {children}
    </EnsContext.Provider>
  )
}

function useEns() {
  const context = useContext(EnsContext)
  return context
}
export { useEns, EnsProvider }
