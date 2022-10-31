import type { JsonRpcSigner } from '@ethersproject/providers'

import { RecordOptions } from '@ansdomain/ensjs/utils/recordHelpers'

import { PublicANS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = {
  name: string
  resolver: string
  records: RecordOptions
}

const displayItems = ({ name }: Data): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
]

const transaction = (signer: JsonRpcSigner, ens: PublicANS, data: Data) => {
  return ens.setRecords.populateTransaction(data.name, {
    records: data.records,
    resolverAddress: data.resolver,
    signer,
  })
}
export default {
  displayItems,
  transaction,
} as Transaction<Data>
