import { Index } from '@polkadot/types/interfaces'
import { hexToU8a } from '@polkadot/util'
import { readFileSync } from 'node:fs'

import { Handlers } from '../shared'

const handlers: Handlers = {
  system_chain: async (context) => {
    return context.chain.api.getSystemChain()
  },
  system_properties: async (context) => {
    return context.chain.api.getSystemProperties()
  },
  system_name: async (context) => {
    return context.chain.api.getSystemName()
  },
  system_version: async (_context) => {
    const { version } = JSON.parse(readFileSync('package.json', 'utf-8'))
    return `chopsticks-v${version}`
  },
  system_chainType: async (_context) => {
    return 'Development'
  },
  system_health: async () => {
    return {
      peers: 0,
      isSyncing: false,
      shouldhVePeers: false,
    }
  },
  system_dryRun: async (context, [extrinsic, at]) => {
    const { outcome } = await context.chain.dryRunExtrinsic(extrinsic, at)
    return outcome.toHex()
  },
  system_accountNextIndex: async (context, [address]) => {
    const head = context.chain.head
    const registry = await head.registry
    const account = registry.createType('AccountId', address)
    const result = await head.call('AccountNonceApi_account_nonce', account.toHex())
    return registry.createType<Index>('Index', hexToU8a(result.result)).toNumber()
  },
}

export default handlers
