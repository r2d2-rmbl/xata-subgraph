/* eslint-disable prefer-const */
import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { MetaStatus,  Router as RouterContract } from '../types/ERC20Forwarder/Router'
import { Transfer, ERC20 as ERC20Contract } from '../types/templates/ERC20/ERC20'
import { Transaction } from '../types/schema'
import {
  convertTokenToDecimal,
  // createUser
} from './helpers'

const ROUTER_ADDRESS = '0xe4C5Cf259351d7877039CBaE0e7f92EB2Ab017EB'
const routerContract = RouterContract.bind(Address.fromString(ROUTER_ADDRESS))

export function handleMetaStatus(event: MetaStatus): void {
  // load factory (create if first exchange)
  let transactionHash = event.transaction.hash.toHexString()
  let transaction = Transaction.load(transactionHash)
  if (transaction === null) {
    transaction = new Transaction(transactionHash)
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.mints = []
    transaction.burns = []
    transaction.swaps = []
  }

  transaction.originalUser = event.params.sender
  transaction.metaStatus = event.params.success

  //TODO: Accumulate feeAmount as USD for each originalUser

  // save updated values
  transaction.save()
}

export function handleERC20Transfer(event: Transfer): void {
  let transactionHash = event.transaction.hash.toHexString()
  let transaction = Transaction.load(transactionHash)
  if (transaction === null) {
    transaction = new Transaction(transactionHash)
    transaction.blockNumber = event.block.number
    transaction.timestamp = event.block.timestamp
    transaction.mints = []
    transaction.burns = []
    transaction.swaps = []
  }

  // record any fees paid to fee holder
  if (event.params.to.toHexString() == routerContract.feeHolder().toHexString()) { // paid to feeHolder
    transaction.feeToken = event.address
    const feeTokenContract = ERC20Contract.bind(event.address)
    transaction.feeAmount = convertTokenToDecimal(event.params.value, BigInt.fromI32(feeTokenContract.decimals()))
  }

  transaction.save()
}
