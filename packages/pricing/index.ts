import {
  ADDRESS_ZERO,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_1E6,
  BIG_DECIMAL_ONE,
  BIG_DECIMAL_ZERO,
  FACTORY_ADDRESS,
  SONESWAP_WETH_USDT_PAIR_ADDRESS,
  SONE_FACTORY_START_BLOCK,
  SONE_TOKEN_ADDRESS,
  SONE_USDT_PAIR_ADDRESS,
  SONE_USDT_PAIR_START_BLOCK,
  UNISWAP_FACTORY_ADDRESS,
  UNISWAP_SONE_ETH_PAIR_FIRST_LIQUDITY_BLOCK,
  UNISWAP_SONE_USDT_PAIR_ADDRESS,
  UNISWAP_WETH_USDT_PAIR_ADDRESS,
  USDT_ADDRESS,
  WETH_ADDRESS,
} from 'const'
import { Address, BigDecimal, BigInt, ethereum, log } from '@graphprotocol/graph-ts'

import { Factory as FactoryContract } from 'exchange/generated/templates/Pair/Factory'
import { Pair as PairContract } from 'exchange/generated/templates/Pair/Pair'

export function getUSDRate(token: Address, block: ethereum.Block): BigDecimal {
  let usdt = BIG_DECIMAL_ONE
  if (token != USDT_ADDRESS) {
    let address = block.number.le(SONE_FACTORY_START_BLOCK)
      ? UNISWAP_WETH_USDT_PAIR_ADDRESS
      : SONESWAP_WETH_USDT_PAIR_ADDRESS

    const tokenPriceETH = getEthRate(token, block)

    const pair = PairContract.bind(address)

    const reserves = pair.getReserves()

    const reserve0 = reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18)

    const reserve1 = reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18)

    const ethPriceUSD = reserve1.div(reserve0).div(BIG_DECIMAL_1E6).times(BIG_DECIMAL_1E18)

    log.info('getUSDRate-----#{}-{}', [
      tokenPriceETH.toString(),
      ethPriceUSD.toString()
    ])

    return ethPriceUSD.times(tokenPriceETH)
  }

  return usdt
}

export function getEthRate(token: Address, block: ethereum.Block): BigDecimal {
  log.info('bbbb====', [])

  let eth = BIG_DECIMAL_ONE

  if (token != WETH_ADDRESS) {
    const factory = FactoryContract.bind(
      block.number.le(SONE_FACTORY_START_BLOCK) ? UNISWAP_FACTORY_ADDRESS : FACTORY_ADDRESS
    )

    const address = factory.getPair(token, WETH_ADDRESS)

    if (address == ADDRESS_ZERO) {
      log.info('Adress ZERO...', [])
      return BIG_DECIMAL_ZERO
    }

    const pair = PairContract.bind(address)

    const reserves = pair.getReserves()

    eth =
      pair.token0() == WETH_ADDRESS
        ? reserves.value0.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value1.toBigDecimal())
        : reserves.value1.toBigDecimal().times(BIG_DECIMAL_1E18).div(reserves.value0.toBigDecimal())

    return eth.div(BIG_DECIMAL_1E18)
  }

  return eth
}

export function getSonePrice(block: ethereum.Block): BigDecimal {
  if (block.number.lt(UNISWAP_SONE_ETH_PAIR_FIRST_LIQUDITY_BLOCK)) {
    // If before uniswap sone-eth pair creation and liquidity added, return zero
    return BIG_DECIMAL_ZERO
  } else if (block.number.lt(SONE_USDT_PAIR_START_BLOCK)) {
    log.info('aaaa====', [])
    // Else if before uniswap sone-usdt pair creation (get price from eth sone-eth pair above)
    return getUSDRate(SONE_TOKEN_ADDRESS, block)
  } else {
    // Else get price from either uni or sone usdt pair depending on space-time
    const pair = PairContract.bind(
      block.number.le(SONE_FACTORY_START_BLOCK) ? UNISWAP_SONE_USDT_PAIR_ADDRESS : SONE_USDT_PAIR_ADDRESS
    )
    const reserves = pair.getReserves()
    return reserves.value1
      .toBigDecimal()
      .times(BIG_DECIMAL_1E18)
      .div(reserves.value0.toBigDecimal())
      .div(BIG_DECIMAL_1E6)
  }
}
