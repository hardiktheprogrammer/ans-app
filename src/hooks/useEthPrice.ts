import { BigNumber, ethers } from 'ethers'
import { useProvider, useQuery } from 'wagmi'

import AggregatorInterface from '@ensdomains/ens-contracts/build/contracts/AggregatorInterface.json'

import { useChainId } from '@app/hooks/useChainId'
import { useEns } from '@app/utils/EnsProvider'

const ORACLE_ANS = 'eth-usd.data.arb'
const ORACLE_GOERLI = '0x01459Ad336768d2293A52e6040632aa1EadD2602' // DummyOracle 

export const useEthPrice = () => {
  const provider = useProvider()
  const { getAddr, ready } = useEns()
  const chainId = useChainId()

  const { data, isLoading: loading } = useQuery(
    ['use-eth-price'],
    async () => {
      let address
      // Arbitrum GOERLI
      if (chainId === 421613) {
        address = ORACLE_GOERLI
      } else {
        address = await getAddr(ORACLE_ANS)
      }
      if (!address) throw new Error('Contract address not found')
      if (typeof address !== 'string') throw new Error('Contract address is wrong type')
      const oracle = new ethers.Contract(address, AggregatorInterface, provider)
      const latest = (await oracle.latestAnswer()) as BigNumber
      return latest
    },
    {
      enabled: !!provider && ready,
    },
  )
  return {
    data,
    loading,
  }
}
