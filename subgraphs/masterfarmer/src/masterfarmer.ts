import {
  Deposit,
  EmergencyWithdraw,
  MasterFarmer as MasterFarmerContract,
  OwnershipTransferred,
  Withdraw,
  Add,
  Set,
  Migrate,
  SetMigrator,
  UpdatePool,
  Dev,
  SendSoneReward,
} from '../generated/MasterFarmer/MasterFarmer'
import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import {
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_ZERO,
  BIG_INT_ONE,
  BIG_INT_ONE_DAY_SECONDS,
  BIG_INT_ZERO,
  MASTER_FARMER_ADDRESS,
} from 'const'
import { History, MasterFarmer, Pool, PoolHistory, User } from '../generated/schema'
import { getUSDRate } from 'pricing'

import { ERC20 as ERC20Contract } from '../generated/MasterFarmer/ERC20'
import { Pair as PairContract } from '../generated/MasterFarmer/Pair'

function getMasterFarmer(block: ethereum.Block): MasterFarmer {
  let masterFarmer = MasterFarmer.load(MASTER_FARMER_ADDRESS.toHex())

  if (masterFarmer === null) {
    const contract = MasterFarmerContract.bind(MASTER_FARMER_ADDRESS)
    masterFarmer = new MasterFarmer(MASTER_FARMER_ADDRESS.toHex())
    masterFarmer.bonusMultiplier = contract.getMultiplier(block.number.minus(BIG_INT_ONE), block.number)
    masterFarmer.bonusEndBlock = contract.FINISH_BONUS_AT_BLOCK()
    masterFarmer.devaddr = contract.devaddr()
    masterFarmer.migrator = contract.migrator()
    masterFarmer.owner = contract.owner()
    // poolInfo ...
    masterFarmer.startBlock = contract.START_BLOCK()
    masterFarmer.sone = contract.sone()
    masterFarmer.sonePerBlock = contract.REWARD_PER_BLOCK()
    masterFarmer.totalAllocPoint = contract.totalAllocPoint()
    // userInfo ...
    masterFarmer.poolCount = BIG_INT_ZERO

    masterFarmer.slpBalance = BIG_DECIMAL_ZERO
    masterFarmer.slpAge = BIG_DECIMAL_ZERO
    masterFarmer.slpAgeRemoved = BIG_DECIMAL_ZERO
    masterFarmer.slpDeposited = BIG_DECIMAL_ZERO
    masterFarmer.slpWithdrawn = BIG_DECIMAL_ZERO

    masterFarmer.updatedAt = block.timestamp

    masterFarmer.save()
  }

  return masterFarmer as MasterFarmer
}

export function getPool(id: BigInt, block: ethereum.Block): Pool {
  let pool = Pool.load(id.toString())

  if (pool === null) {
    const masterFarmer = getMasterFarmer(block)

    const masterFarmerContract = MasterFarmerContract.bind(MASTER_FARMER_ADDRESS)
    const poolLength = masterFarmerContract.poolLength()

    if (id >= poolLength) {
      return null
    }
    // Create new pool.
    pool = new Pool(id.toString())

    // Set relation
    pool.owner = masterFarmer.id

    const poolInfo = masterFarmerContract.poolInfo(masterFarmer.poolCount)

    pool.pair = poolInfo.value0
    pool.allocPoint = poolInfo.value1
    pool.lastRewardBlock = poolInfo.value2
    pool.accSonePerShare = poolInfo.value3

    // Total supply of LP tokens
    pool.balance = BIG_INT_ZERO
    pool.userCount = BIG_INT_ZERO

    pool.slpBalance = BIG_DECIMAL_ZERO
    pool.slpAge = BIG_DECIMAL_ZERO
    pool.slpAgeRemoved = BIG_DECIMAL_ZERO
    pool.slpDeposited = BIG_DECIMAL_ZERO
    pool.slpWithdrawn = BIG_DECIMAL_ZERO

    pool.timestamp = block.timestamp
    pool.block = block.number

    pool.updatedAt = block.timestamp
    pool.entryUSD = BIG_DECIMAL_ZERO
    pool.exitUSD = BIG_DECIMAL_ZERO
    pool.soneHarvested = BIG_DECIMAL_ZERO
    pool.save()
  }

  return pool as Pool
}

function getHistory(owner: string, block: ethereum.Block): History {
  const day = block.timestamp.div(BIG_INT_ONE_DAY_SECONDS)

  const id = owner.concat(day.toString())

  let history = History.load(id)

  if (history === null) {
    history = new History(id)
    history.owner = owner
    history.slpBalance = BIG_DECIMAL_ZERO
    history.slpAge = BIG_DECIMAL_ZERO
    history.slpAgeRemoved = BIG_DECIMAL_ZERO
    history.slpDeposited = BIG_DECIMAL_ZERO
    history.slpWithdrawn = BIG_DECIMAL_ZERO
    history.timestamp = block.timestamp
    history.block = block.number
  }

  return history as History
}

function getPoolHistory(pool: Pool, block: ethereum.Block): PoolHistory {
  const day = block.timestamp.div(BIG_INT_ONE_DAY_SECONDS)

  const id = pool.id.concat(day.toString())

  let history = PoolHistory.load(id)

  if (history === null) {
    history = new PoolHistory(id)
    history.pool = pool.id
    history.slpBalance = BIG_DECIMAL_ZERO
    history.slpAge = BIG_DECIMAL_ZERO
    history.slpAgeRemoved = BIG_DECIMAL_ZERO
    history.slpDeposited = BIG_DECIMAL_ZERO
    history.slpWithdrawn = BIG_DECIMAL_ZERO
    history.timestamp = block.timestamp
    history.block = block.number
    history.userCount = BIG_INT_ZERO
    history.entryUSD = BIG_DECIMAL_ZERO
    history.exitUSD = BIG_DECIMAL_ZERO
    history.soneHarvested = BIG_DECIMAL_ZERO
  }

  return history as PoolHistory
}

export function getUser(pid: BigInt, address: Address, block: ethereum.Block): User {
  const uid = address.toHex()
  const id = pid.toString().concat('-').concat(uid)

  let user = User.load(id)

  if (user === null) {
    user = new User(id)
    user.pool = null
    user.address = address
    user.amount = BIG_INT_ZERO
    user.rewardDebt = BIG_INT_ZERO
    user.soneHarvested = BIG_DECIMAL_ZERO
    user.entryUSD = BIG_DECIMAL_ZERO
    user.exitUSD = BIG_DECIMAL_ZERO
    user.timestamp = block.timestamp
    user.block = block.number
    user.save()
  }

  return user as User
}

export function add(event: Add): void {
  log.info('Param event add: #{}---#{}---#{}', [
    event.params.allocPoint.toString(),
    event.params.lpToken.toHex(),
    event.params.withUpdate ? 'true' : 'false',
  ])
  const masterFarmer = getMasterFarmer(event.block)

  log.info('Add pool #{}', [masterFarmer.poolCount.toString()])

  const pool = getPool(masterFarmer.poolCount, event.block)

  if (pool === null) {
    log.error('Pool added with id greater than poolLength, pool #{}', [masterFarmer.poolCount.toString()])
    return
  }

  // Update MasterFarmer.
  masterFarmer.totalAllocPoint = masterFarmer.totalAllocPoint.plus(pool.allocPoint)
  masterFarmer.poolCount = masterFarmer.poolCount.plus(BIG_INT_ONE)
  masterFarmer.save()
}

export function set(event: Set): void {
  log.info('Param event set #{}---#{}---#{}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString(),
    event.params.withUpdate ? 'true' : 'false',
  ])

  const pool = getPool(event.params.pid, event.block)

  const masterFarmer = getMasterFarmer(event.block)

  // Update masterfarmer
  masterFarmer.totalAllocPoint = masterFarmer.totalAllocPoint.plus(event.params.allocPoint.minus(pool.allocPoint))
  masterFarmer.save()

  // Update pool
  pool.allocPoint = event.params.allocPoint
  pool.save()
}

export function setMigrator(event: SetMigrator): void {
  log.info('Param event setMigrator #{}', [event.params.migrator.toHex()])
  const masterFarmer = getMasterFarmer(event.block)
  masterFarmer.migrator = event.params.migrator
  masterFarmer.save()
}

export function migrate(event: Migrate): void {
  log.info('Param event migrate #{}', [event.params.pid.toString()])
  const masterFarmerContract = MasterFarmerContract.bind(MASTER_FARMER_ADDRESS)

  const pool = getPool(event.params.pid, event.block)
  const poolInfo = masterFarmerContract.poolInfo(event.params.pid)
  const pair = poolInfo.value0
  const pairContract = PairContract.bind(pair as Address)
  pool.pair = pair
  const balance = pairContract.balanceOf(MASTER_FARMER_ADDRESS)
  pool.balance = balance
  pool.save()
}

export function updatePool(event: UpdatePool): void {
  log.info('Param event updatePool #{}', [event.params.pid.toString()])
  const masterFarmer = MasterFarmerContract.bind(MASTER_FARMER_ADDRESS)
  const poolInfo = masterFarmer.poolInfo(event.params.pid)
  const pool = getPool(event.params.pid, event.block)
  pool.lastRewardBlock = poolInfo.value2
  pool.accSonePerShare = poolInfo.value3
  pool.save()
}

export function dev(event: Dev): void {
  log.info('Param event dev #{}', [event.params.devaddr.toHex()])
  const masterFarmer = getMasterFarmer(event.block)
  masterFarmer.devaddr = event.params.devaddr
  masterFarmer.save()
}

export function deposit(event: Deposit): void {
  log.info('Param event deposit #{}---#{}---#{}', [
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.user.toHex(),
  ])
  const amount = event.params.amount.divDecimal(BIG_DECIMAL_1E18)
  const masterFarmerContract = MasterFarmerContract.bind(MASTER_FARMER_ADDRESS)
  const poolInfo = masterFarmerContract.poolInfo(event.params.pid)
  const pool = getPool(event.params.pid, event.block)
  const poolHistory = getPoolHistory(pool, event.block)
  const pairContract = PairContract.bind(poolInfo.value0)
  pool.balance = pairContract.balanceOf(MASTER_FARMER_ADDRESS)

  pool.lastRewardBlock = poolInfo.value2
  pool.accSonePerShare = poolInfo.value3

  const poolDays = event.block.timestamp.minus(pool.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  pool.slpAge = pool.slpAge.plus(poolDays.times(pool.slpBalance))

  pool.slpDeposited = pool.slpDeposited.plus(amount)
  pool.slpBalance = pool.slpBalance.plus(amount)

  pool.updatedAt = event.block.timestamp

  const userInfo = masterFarmerContract.userInfo(event.params.pid, event.params.user)

  const user = getUser(event.params.pid, event.params.user, event.block)

  // If not currently in pool and depositing SLP
  if (!user.pool && event.params.amount.gt(BIG_INT_ZERO)) {
    user.pool = pool.id
    pool.userCount = pool.userCount.plus(BIG_INT_ONE)
  }

  user.amount = userInfo.value0
  user.rewardDebt = userInfo.value1

  if (event.params.amount.gt(BIG_INT_ZERO)) {
    const reservesResult = pairContract.try_getReserves()
    if (!reservesResult.reverted) {
      const totalSupply = pairContract.totalSupply()

      const share = amount.div(totalSupply.toBigDecimal())

      const token0Amount = reservesResult.value.value0.toBigDecimal().times(share)

      const token1Amount = reservesResult.value.value1.toBigDecimal().times(share)

      const token0PriceUSD = getUSDRate(pairContract.token0(), event.block)

      const token1PriceUSD = getUSDRate(pairContract.token1(), event.block)

      const token0USD = token0Amount.times(token0PriceUSD)

      const token1USD = token1Amount.times(token1PriceUSD)

      const entryUSD = token0USD.plus(token1USD)

      user.entryUSD = user.entryUSD.plus(entryUSD)

      pool.entryUSD = pool.entryUSD.plus(entryUSD)

      poolHistory.entryUSD = pool.entryUSD
    }
  }

  user.save()
  pool.save()

  const masterFarmer = getMasterFarmer(event.block)

  const masterFarmerDays = event.block.timestamp
    .minus(masterFarmer.updatedAt)
    .divDecimal(BigDecimal.fromString('86400'))
  masterFarmer.slpAge = masterFarmer.slpAge.plus(masterFarmerDays.times(masterFarmer.slpBalance))

  masterFarmer.slpDeposited = masterFarmer.slpDeposited.plus(amount)
  masterFarmer.slpBalance = masterFarmer.slpBalance.plus(amount)

  masterFarmer.updatedAt = event.block.timestamp
  masterFarmer.save()

  const history = getHistory(MASTER_FARMER_ADDRESS.toHex(), event.block)
  history.slpAge = masterFarmer.slpAge
  history.slpBalance = masterFarmer.slpBalance
  history.slpDeposited = history.slpDeposited.plus(amount)
  history.save()

  poolHistory.slpAge = pool.slpAge
  poolHistory.slpBalance = pool.balance.divDecimal(BIG_DECIMAL_1E18)
  poolHistory.slpDeposited = poolHistory.slpDeposited.plus(amount)
  poolHistory.userCount = pool.userCount
  poolHistory.save()
}

export function withdraw(event: Withdraw): void {
  log.info('Param event withdraw #{}---#{}---#{}', [
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.user.toHex(),
  ])

  const amount = event.params.amount.divDecimal(BIG_DECIMAL_1E18)

  const masterFarmerContract = MasterFarmerContract.bind(MASTER_FARMER_ADDRESS)

  const poolInfo = masterFarmerContract.poolInfo(event.params.pid)

  const pool = getPool(event.params.pid, event.block)

  const poolHistory = getPoolHistory(pool, event.block)

  const pairContract = PairContract.bind(poolInfo.value0)
  pool.balance = pairContract.balanceOf(MASTER_FARMER_ADDRESS)
  pool.lastRewardBlock = poolInfo.value2
  pool.accSonePerShare = poolInfo.value3

  const poolDays = event.block.timestamp.minus(pool.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  const poolAge = pool.slpAge.plus(poolDays.times(pool.slpBalance))
  const poolAgeRemoved = poolAge.div(pool.slpBalance).times(amount)
  pool.slpAge = poolAge.minus(poolAgeRemoved)
  pool.slpAgeRemoved = pool.slpAgeRemoved.plus(poolAgeRemoved)
  pool.slpWithdrawn = pool.slpWithdrawn.plus(amount)
  pool.slpBalance = pool.slpBalance.minus(amount)
  pool.updatedAt = event.block.timestamp

  const user = getUser(event.params.pid, event.params.user, event.block)

  const userInfo = masterFarmerContract.userInfo(event.params.pid, event.params.user)

  user.amount = userInfo.value0
  user.rewardDebt = userInfo.value1

  if (event.params.amount.gt(BIG_INT_ZERO)) {
    const reservesResult = pairContract.try_getReserves()

    if (!reservesResult.reverted) {
      const totalSupply = pairContract.totalSupply()

      const share = amount.div(totalSupply.toBigDecimal())

      const token0Amount = reservesResult.value.value0.toBigDecimal().times(share)

      const token1Amount = reservesResult.value.value1.toBigDecimal().times(share)

      const token0PriceUSD = getUSDRate(pairContract.token0(), event.block)

      const token1PriceUSD = getUSDRate(pairContract.token1(), event.block)

      const token0USD = token0Amount.times(token0PriceUSD)

      const token1USD = token1Amount.times(token1PriceUSD)

      const exitUSD = token0USD.plus(token1USD)

      pool.exitUSD = pool.exitUSD.plus(exitUSD)

      poolHistory.exitUSD = pool.exitUSD

      user.exitUSD = user.exitUSD.plus(exitUSD)
    } else {
      log.info("Withdraw couldn't get reserves for pair {}", [poolInfo.value0.toHex()])
    }
  }

  // If SLP amount equals zero, remove from pool and reduce userCount
  if (user.amount.equals(BIG_INT_ZERO)) {
    user.pool = null
    pool.userCount = pool.userCount.minus(BIG_INT_ONE)
  }

  user.save()
  pool.save()

  const masterFarmer = getMasterFarmer(event.block)

  const days = event.block.timestamp.minus(masterFarmer.updatedAt).divDecimal(BigDecimal.fromString('86400'))
  const slpAge = masterFarmer.slpAge.plus(days.times(masterFarmer.slpBalance))
  const slpAgeRemoved = slpAge.div(masterFarmer.slpBalance).times(amount)
  masterFarmer.slpAge = slpAge.minus(slpAgeRemoved)
  masterFarmer.slpAgeRemoved = masterFarmer.slpAgeRemoved.plus(slpAgeRemoved)

  masterFarmer.slpWithdrawn = masterFarmer.slpWithdrawn.plus(amount)
  masterFarmer.slpBalance = masterFarmer.slpBalance.minus(amount)
  masterFarmer.updatedAt = event.block.timestamp
  masterFarmer.save()

  const history = getHistory(MASTER_FARMER_ADDRESS.toHex(), event.block)
  history.slpAge = masterFarmer.slpAge
  history.slpAgeRemoved = history.slpAgeRemoved.plus(slpAgeRemoved)
  history.slpBalance = masterFarmer.slpBalance
  history.slpWithdrawn = history.slpWithdrawn.plus(amount)
  history.save()

  poolHistory.slpAge = pool.slpAge
  poolHistory.slpAgeRemoved = poolHistory.slpAgeRemoved.plus(slpAgeRemoved)
  poolHistory.slpBalance = pool.balance.divDecimal(BIG_DECIMAL_1E18)
  poolHistory.slpWithdrawn = poolHistory.slpWithdrawn.plus(amount)
  poolHistory.userCount = pool.userCount
  poolHistory.save()
}

export function emergencyWithdraw(event: EmergencyWithdraw): void {
  log.info('Param event emergencyWithdraw #{}---#{}---#{}', [
    event.params.user.toHex(),
    event.params.amount.toString(),
    event.params.pid.toString(),
  ])

  const pool = getPool(event.params.pid, event.block)

  const pairContract = PairContract.bind(pool.pair as Address)
  pool.balance = pairContract.balanceOf(MASTER_FARMER_ADDRESS)
  pool.save()

  // Update user
  const user = getUser(event.params.pid, event.params.user, event.block)
  user.amount = BIG_INT_ZERO
  user.rewardDebt = BIG_INT_ZERO

  user.save()
}

export function ownershipTransferred(event: OwnershipTransferred): void {
  log.info('Param event ownershipTransferred #{}---#{}', [
    event.params.previousOwner.toHex(),
    event.params.newOwner.toHex(),
  ])
  const masterFarmer = getMasterFarmer(event.block)
  masterFarmer.owner = event.params.newOwner
  masterFarmer.save()
}

export function sendSoneReward(event: SendSoneReward): void {
  log.info('Param event sendSoneReward #{}---#{}---#{}---#{}', [
    event.params.pid.toString(),
    event.params.user.toHex(),
    event.params.amount.toString(),
    event.params.lockAmount.toString()
  ])
  const masterFarmerContract = MasterFarmerContract.bind(MASTER_FARMER_ADDRESS)
  const userInfo = masterFarmerContract.userInfo(event.params.pid, event.params.user)
  const user = getUser(event.params.pid, event.params.user, event.block)
  const pool = getPool(event.params.pid, event.block)
  const poolHistory = getPoolHistory(pool, event.block)
  const amount = event.params.amount.toBigDecimal().div(BIG_DECIMAL_1E18)
  user.soneHarvested = user.soneHarvested.plus(amount)
  user.rewardDebt = userInfo.value1
  pool.soneHarvested = pool.soneHarvested.plus(amount)
  poolHistory.soneHarvested = pool.soneHarvested
  user.save()
  pool.save()
  poolHistory.save()
}

export function handleBlock(block: ethereum.Block): void {
  log.info('Param handleBlock #{}', [block.number.toString()])
  const masterFarmer = MasterFarmer.load(MASTER_FARMER_ADDRESS.toHex())

  if (masterFarmer !== null) {
    // Update masterfamermer bonusMultiplier
    const contract = MasterFarmerContract.bind(MASTER_FARMER_ADDRESS)
    masterFarmer.bonusMultiplier = contract.getMultiplier(block.number.minus(BIG_INT_ONE), block.number)
    masterFarmer.save()
  }
}
