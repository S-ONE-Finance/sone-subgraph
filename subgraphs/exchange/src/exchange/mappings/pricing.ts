/* eslint-disable prefer-const */
import { log } from '@graphprotocol/graph-ts'
import { Pair, Token, Bundle } from '../../../generated/schema'
import { BigDecimal, Address, BigInt } from '@graphprotocol/graph-ts/index'
import { ZERO_BD, factoryContract, ADDRESS_ZERO, ONE_BD, UNTRACKED_PAIRS } from './helpers'

// Ropsten addresses
// const WETH_ADDRESS = '0xc778417e063141139fce010982780140aa0cd5ab'
// const USDC_WETH_PAIR = '0x83116f17695e496e4250005e242d1770708792e5'
// const DAI_WETH_PAIR = '0xa41e305d60061af83182ac515dc859e76cfd8ce9' 
// const USDT_WETH_PAIR = '0x1557aecd250080dc3dcc4539392f429f32487fff'

// const WETH_ADDRESS = '0xc778417e063141139fce010982780140aa0cd5ab'
// const USDC_WETH_PAIR = '0x1c0e5563d1d7e662deae672d470dc9e813793585'
// const DAI_WETH_PAIR = '0x401ec9e948d6eaa694714eaf4ebb3b6c5e11025a' 
// const USDT_WETH_PAIR = '0xc061f7d573bcd723deaf4c333c63be0486248508'

// Rinkeby addresses
// const WETH_ADDRESS = '0x18665a1eb12785a38118ef2063abb587e42d51e8'
// const USDC_WETH_PAIR = '0x301de729232b4003d268d17ab0d1eefe03785c2c'
// const DAI_WETH_PAIR = '0x6a5d071c0b91452507ce5ef261491a7c9019dee1'
// const USDT_WETH_PAIR = '0xe90d087b5509f20e530c660dab9024f0224be021'

// Mainnet addresses
const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const USDC_WETH_PAIR = ''
const DAI_WETH_PAIR = ''
const USDT_WETH_PAIR = '0xd2d846b1255e81e816cb61402389449f9cf4d3bf'

// Ganache addresses
// const WETH_ADDRESS = '0x5B62636C6d2b79fE47B131F0afee4a71aDf9723B'
// const USDC_WETH_PAIR = '0xEc4e894AfB353844FCfCA6654eeC02c6190C4081'
// const DAI_WETH_PAIR = '0x6E98Da3C3a31E0a48188319c18bd8Bfe2e968DBB' 
// const USDT_WETH_PAIR = '0x686F00AEb7c59374a56BBc62fB521c50744C9D2A'

export function getEthPriceInUSD(): BigDecimal {
  // [Origin]
  // fetch eth prices for each stablecoin
  // let daiPair = Pair.load(DAI_WETH_PAIR) // dai is token0
  // let usdcPair = Pair.load(USDC_WETH_PAIR) // usdc is token0
  // let usdtPair = Pair.load(USDT_WETH_PAIR) // usdt is token1

  // // all 3 have been created
  // if (daiPair !== null && usdcPair !== null && usdtPair !== null) {
  //   let totalLiquidityETH = daiPair.reserve1.plus(usdcPair.reserve1).plus(usdtPair.reserve0)
  //   let daiWeight = daiPair.reserve1.div(totalLiquidityETH)
  //   let usdcWeight = usdcPair.reserve1.div(totalLiquidityETH)
  //   let usdtWeight = usdtPair.reserve0.div(totalLiquidityETH)
  //   return daiPair.token0Price
  //     .times(daiWeight)
  //     .plus(usdcPair.token0Price.times(usdcWeight))
  //     .plus(usdtPair.token1Price.times(usdtWeight))
  //   // dai and USDC have been created
  // } else if (daiPair !== null && usdtPair !== null) {
  //   let totalLiquidityETH = daiPair.reserve1.plus(usdtPair.reserve1)
  //   let daiWeight = daiPair.reserve1.div(totalLiquidityETH)
  //   let usdcWeight = usdtPair.reserve1.div(totalLiquidityETH)
  //   return daiPair.token0Price.times(daiWeight).plus(usdtPair.token0Price.times(usdcWeight))
  //   // USDC is the only pair so far
  // } else if (usdtPair !== null) {
  //   return usdtPair.token0Price
  // } else {
  //   return ZERO_BD
  // }

  // [Custom] - Ropsten
  // let daiPair = Pair.load(DAI_WETH_PAIR) // dai is token0
  // let usdcPair = Pair.load(USDC_WETH_PAIR) // usdc is token1
  // let usdtPair = Pair.load(USDT_WETH_PAIR) // usdt is token0
  
  // // all 3 have been created
  // if (daiPair !== null && usdcPair !== null && usdtPair !== null) {
  //   let totalLiquidityETH = daiPair.reserve1.plus(usdcPair.reserve0).plus(usdtPair.reserve1)
  //   let daiWeight = daiPair.reserve1.div(totalLiquidityETH)
  //   let usdcWeight = usdcPair.reserve0.div(totalLiquidityETH)
  //   let usdtWeight = usdtPair.reserve1.div(totalLiquidityETH)
  //   return daiPair.token0Price
  //     .times(daiWeight)
  //     .plus(usdcPair.token1Price.times(usdcWeight))
  //     .plus(usdtPair.token0Price.times(usdtWeight))
  //   // dai and USDC have been created
  // } else if (daiPair !== null && usdtPair !== null) {
  //   let totalLiquidityETH = daiPair.reserve1.plus(usdtPair.reserve1)
  //   let daiWeight = daiPair.reserve0.div(totalLiquidityETH)
  //   let usdtWeight = usdtPair.reserve0.div(totalLiquidityETH)
  //   return daiPair.token0Price.times(daiWeight).plus(usdtPair.token0Price.times(usdtWeight))
  //   // USDC is the only pair so far
  // } else if (usdtPair !== null) {
  //   return usdtPair.token0Price
  // } else {
  //   return ZERO_BD
  // }
  // [Custom] - Rinkeby
  let daiPair = Pair.load(DAI_WETH_PAIR) // dai is token1
  let usdcPair = Pair.load(USDC_WETH_PAIR) // usdc is token1
  let usdtPair = Pair.load(USDT_WETH_PAIR) // usdt is token1
  // all 3 have been created
  if (daiPair !== null && usdcPair !== null && usdtPair !== null) {
    let totalLiquidityETH = daiPair.reserve0.plus(usdcPair.reserve0).plus(usdtPair.reserve1)
    let daiWeight = daiPair.reserve0.div(totalLiquidityETH)
    let usdcWeight = usdcPair.reserve0.div(totalLiquidityETH)
    let usdtWeight = usdtPair.reserve1.div(totalLiquidityETH)
    return daiPair.token1Price
      .times(daiWeight)
      .plus(usdcPair.token1Price.times(usdcWeight))
      .plus(usdtPair.token0Price.times(usdtWeight))
    // dai and USDC have been created
  } else if (daiPair !== null && usdtPair !== null) {
    let totalLiquidityETH = daiPair.reserve0.plus(usdtPair.reserve1)
    let daiWeight = daiPair.reserve0.div(totalLiquidityETH)
    let usdtWeight = usdtPair.reserve1.div(totalLiquidityETH)
    return daiPair.token1Price.times(daiWeight).plus(usdtPair.token0Price.times(usdtWeight))
    // USDC is the only pair so far
  } else if (usdtPair !== null) {
    return usdtPair.token1Price
  } else {
    return ZERO_BD
  }


  // all 3 have been created
  // if (daiPair !== null && usdcPair !== null && usdtPair !== null) {
  //   let daiPairToken0: Token = Token.load(daiPair.token0) as Token
  //   let usdcPairToken0: Token = Token.load(usdcPair.token0) as Token
  //   let usdtPairToken0: Token = Token.load(usdtPair.token0) as Token
  
  //   let daiReserve = daiPairToken0.symbol == "DAI" ? daiPair.reserve0 : daiPair.reserve1
  //   let usdcReserve = usdcPairToken0.symbol == "USDC" ? usdcPair.reserve0 : usdcPair.reserve1
  //   let usdtReserve = usdtPairToken0.symbol == "USDT" ? usdtPair.reserve0 : usdtPair.reserve1
  
  //   let daiPrice = daiPairToken0.symbol == "DAI" ? daiPair.token0Price : daiPair.token1Price
  //   let usdcPrice = usdcPairToken0.symbol == "USDC" ? usdcPair.token0Price : usdcPair.token1Price
  //   let usdtPrice = usdtPairToken0.symbol == "USDT" ? usdtPair.token0Price : usdtPair.token1Price

  //   let totalLiquidityETH = daiReserve.plus(usdcReserve).plus(usdtReserve)
  //   let daiWeight = daiReserve.div(totalLiquidityETH)
  //   let usdcWeight = usdcReserve.div(totalLiquidityETH)
  //   let usdtWeight = usdtReserve.div(totalLiquidityETH)

  //   log.debug(`Pricing: daiPrice.times(daiWeight): {}`, [daiPrice.times(daiWeight).toString()])
  //   log.debug(`Pricing: usdcPrice.times(usdcWeight): {}`, [usdcPrice.times(usdcWeight).toString()])
  //   log.debug(`Pricing: usdtPrice.times(usdtWeight): {}`, [usdtPrice.times(usdtWeight).toString()])

  //   return daiPrice
  //     .times(daiWeight)
  //     .plus(usdcPrice.times(usdcWeight))
  //     .plus(usdtPrice.times(usdtWeight))
  //   // dai and USDC have been created
  // } else if (daiPair !== null && usdtPair !== null) {
  //   let daiPairToken0: Token = Token.load(daiPair.token0) as Token
  //   let usdtPairToken0: Token = Token.load(usdtPair.token0) as Token
  
  //   let daiReserve = daiPairToken0.symbol == "DAI" ? daiPair.reserve0 : daiPair.reserve1
  //   let usdtReserve = usdtPairToken0.symbol == "USDT" ? usdtPair.reserve0 : usdtPair.reserve1
  
  //   let daiPrice = daiPairToken0.symbol == "DAI" ? daiPair.token0Price : daiPair.token1Price
  //   let usdtPrice = usdtPairToken0.symbol == "USDT" ? usdtPair.token0Price : usdtPair.token1Price

  //   let totalLiquidityETH = daiReserve.plus(usdtReserve)
  //   let daiWeight = daiReserve.div(totalLiquidityETH)
  //   let usdtWeight = usdtReserve.div(totalLiquidityETH)

  //   log.debug(`Pricing: daiPrice.times(daiWeight): {}`, [daiPrice.times(daiWeight).toString()])
  //   log.debug(`Pricing: usdtPrice.times(usdtWeight): {}`, [usdtPrice.times(usdtWeight).toString()])

  //   return daiPrice.times(daiWeight).plus(usdtPrice.times(usdtWeight))
  //   // USDC is the only pair so far
  // } else if (usdtPair !== null) {
  //   let usdtPairToken0: Token = Token.load(usdtPair.token0) as Token
  //   let usdtPrice = usdtPairToken0.symbol == "USDT" ? usdtPair.token0Price : usdtPair.token1Price

  //   log.debug(`Pricing: usdtPrice: {}`, [usdtPrice.toString()])

  //   return usdtPrice
  // } else {
  //   return ZERO_BD
  // }
}

// token where amounts should contribute to tracked volume and liquidity
let WHITELIST: string[] = [
  // Ropsten addresses
  // '0xc778417e063141139fce010982780140aa0cd5ab', // WETH
  // '0x266d839248f3a920c77d45c4361f707627a907d9', // DAI
  // '0xf1732c0b75558a6be7658860a34a0077c440be90', // USDC
  // '0x393397baae01dc19678220e4d3fd34fda4febd1d', // USDT
  // '0x57bb30bdb0d449bf687ed648acf2467f045c8e74', // SONE

  // Rinkeby addresses
  // '0x18665a1eb12785a38118ef2063abb587e42d51e8', // WETH
  // '0x4a732cef0892afe9d7fb021b67266595791b6c01', // DAI
  // '0x4adbe0738e934a5e220928a375b82d95f00d29e9', // USDC
  // '0x12cd536e6de4aff412a62482d45433c83ef39ffc', // USDT
  // '0x5fea1f4aef9c78bc56ced5083fb59d351396748f', // SONE

  // Mainnet addresses
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
  '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
  '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
  '0xf5c771e0b749444eaec5c1f7ef5c0b93200bb0e4', // SONE

  // Ganache addresses
  // '0x5B62636C6d2b79fE47B131F0afee4a71aDf9723B', // WETH
  // '0xF0e4024f29Fd73F2c1757b7d9CbA93de76100feF', // DAI
  // '0x78bA67047aB65c73d699B6eE54620E6c46f97840', // USDC
  // '0x635BCc6A77d9B42B0483f2dED34b9f1A97A221Df', // USDT
  // '0x337006106E7Dacd7D84b91F9BCB6cB1182837870', // SONE

  // '0x0000000000085d4780b73119b644ae5ecd22b376', // TUSD
  // '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643', // cDAI
  // '0x39aa39c021dfbae8fac545936693ac917d5e7563', // cUSDC
  // '0x86fadb80d8d2cff3c3680819e4da99c10232ba0f', // EBASE
  // '0x57ab1ec28d129707052df4df418d58a2d46d5f51', // sUSD
  // '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', // MKR
  // '0xc00e94cb662c3520282e6f5717214004a7f26888', // COMP
  // '0x514910771af9ca656af840dff83e8264ecf986ca', // LINK
  // '0x960b236a07cf122663c4303350609a66a7b288c0', // ANT
  // '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f', // SNX
  // '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e', // YFI
  // '0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8', // yCurv
  // '0x853d955acef822db058eb8505911ed77f175b99e', // FRAX
  // '0xa47c8bf37f92abed4a126bda807a7b7498661acd', // WUST
  // '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', // UNI
  // '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'  // WBTC
]

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('4') // 4000

// minimum liquidity for price to get tracked
let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('0.1') // 2

/**
 * Search through graph to find derived Eth per token.
 * @todo update to be derived ETH (add stablecoin estimates)
 **/
export function findEthPerToken(token: Token): BigDecimal {
  if (token.id == WETH_ADDRESS) {
    return ONE_BD
  }
  // loop through whitelist and check if paired with any
  for (let i = 0; i < WHITELIST.length; ++i) {
    if (token.id == WHITELIST[i]) {
      continue
    }
    let pairAddress = factoryContract.getPair(Address.fromString(token.id), Address.fromString(WHITELIST[i]))
    // log.debug(`Pricing: Pair address of {} and {} is: {}`, [token.id, WHITELIST[i], pairAddress.toHexString()])
    if (pairAddress.toHexString() != ADDRESS_ZERO) {
      let pair = Pair.load(pairAddress.toHexString())
      // log.debug(`Pricing: reserveETH: {}-{}`, [pair.reserveETH.toString(), pair.id])
      // log.debug(`Pricing: MINIMUM_LIQUIDITY_THRESHOLD_ETH: {}`, [MINIMUM_LIQUIDITY_THRESHOLD_ETH.toString()])
      if (pair.token0 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
        // log.debug(`pair.token0 == token.id`, [])
        let token1 = Token.load(pair.token1)
        return pair.token1Price.times(token1.derivedETH as BigDecimal) // return token1 per our token * Eth per token 1
      }
      if (pair.token1 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
        // log.debug(`pair.token1 == token.id`, [])
        let token0 = Token.load(pair.token0)
        return pair.token0Price.times(token0.derivedETH as BigDecimal) // return token0 per our token * ETH per token 0
      }
    }
  }
  return ZERO_BD // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 */
export function getTrackedVolumeUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token,
  pair: Pair
): BigDecimal {
  let bundle = Bundle.load('1')
  let price0 = token0.derivedETH.times(bundle.ethPrice)
  let price1 = token1.derivedETH.times(bundle.ethPrice)

  // dont count tracked volume on these pairs - usually rebass tokens
  if (UNTRACKED_PAIRS.includes(pair.id)) {
    return ZERO_BD
  }

  // if less than 5 LPs, require high minimum reserve amount amount or return 0
  if (pair.liquidityProviderCount.lt(BigInt.fromI32(1))) { // BigInt.fromI32(5)
    let reserve0USD = pair.reserve0.times(price0)
    let reserve1USD = pair.reserve1.times(price1)
    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve0USD.plus(reserve1USD).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
      if (reserve0USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
      if (reserve1USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
        return ZERO_BD
      }
    }
  }

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0
      .times(price0)
      .plus(tokenAmount1.times(price1))
      .div(BigDecimal.fromString('2'))
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0)
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1)
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedLiquidityUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let bundle = Bundle.load('1')
  let price0 = token0.derivedETH.times(bundle.ethPrice)
  let price1 = token1.derivedETH.times(bundle.ethPrice)

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1))
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(BigDecimal.fromString('2'))
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(BigDecimal.fromString('2'))
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD
}
