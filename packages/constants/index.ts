import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export const ADDRESS_ZERO = Address.fromString('0x0000000000000000000000000000000000000000')

export const BIG_DECIMAL_1E6 = BigDecimal.fromString('1e6')

export const BIG_DECIMAL_1E12 = BigDecimal.fromString('1e12')

export const BIG_DECIMAL_1E18 = BigDecimal.fromString('1e18')

export const BIG_DECIMAL_ZERO = BigDecimal.fromString('0')

export const BIG_DECIMAL_ONE = BigDecimal.fromString('1')

export const BIG_INT_ONE = BigInt.fromI32(1)

export const BIG_INT_TWO = BigInt.fromI32(2)

export const BIG_INT_ONE_HUNDRED = BigInt.fromI32(100)

export const BIG_INT_ONE_DAY_SECONDS = BigInt.fromI32(86400)

export const BIG_INT_ZERO = BigInt.fromI32(0)

export const LOCKUP_POOL_NUMBER = BigInt.fromI32(29)

export const FACTORY_ADDRESS = Address.fromString('0x096673dd28e215450218e02c1c22978e3e588a35')

export const LOCKUP_BLOCK_NUMBER = BigInt.fromI32(10959148)

export const MASTER_FARMER_ADDRESS = Address.fromString('0xb5aefea17ec832d2dcaf0a9c160db96f86fc5db9')

export const SONE_TOKEN_ADDRESS = Address.fromString('0xf5c771e0b749444eaec5c1f7ef5c0b93200bb0e4')

export const SONE_USDT_PAIR_ADDRESS = Address.fromString('0xa62b744736c80f4c93b8fb5d69f910f08c6f3521')

export const SONE_DISTRIBUTOR_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const USDC_WETH_PAIR = ''

export const DAI_WETH_PAIR = ''

export const USDT_WETH_PAIR = '0xd2d846b1255e81e816cb61402389449f9cf4d3bf'

export const SONE_USDT_PAIR = '0xa62b744736c80f4c93b8fb5d69f910f08c6f3521'

export const UNISWAP_WETH_USDT_PAIR = '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852'

export const UNISWAP_WETH_DAI_PAIR = '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11'

export const UNISWAP_WETH_USDC_PAIR = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc'

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('0')

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('5')

export const WETH_ADDRESS = Address.fromString('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')

export const SONESWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('0xd2d846b1255e81e816cb61402389449f9cf4d3bf')

export const USDT_ADDRESS = Address.fromString('0xdac17f958d2ee523a2206206994597c13d831ec7')

export const MASTER_FARMER_START_BLOCK = BigInt.fromString('0')

export const UNISWAP_FACTORY_ADDRESS = Address.fromString('0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f')

export const UNISWAP_SONE_ETH_PAIR_FIRST_LIQUDITY_BLOCK = BigInt.fromString('0')

export const UNISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852')

export const UNISWAP_WETH_DAI_PAIR_ADDRESS = Address.fromString('0xa478c2975ab1ea89e8196811f51a7b7ade33eb11')

export const UNISWAP_WETH_USDC_PAIR_ADDRESS = Address.fromString('0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc')

export const UNISWAP_SONE_ETH_PAIR_ADDRESS = Address.fromString('0xc4d0e8f525c0d1bf585dcf4b61111084a2211693')

export const UNISWAP_SONE_USDT_PAIR_ADDRESS = Address.fromString('0xa62b744736c80f4c93b8fb5d69f910f08c6f3521')

export const SONE_FACTORY_START_BLOCK = BigInt.fromString('0')

export const SONE_USDT_PAIR_START_BLOCK = BigInt.fromString('0')