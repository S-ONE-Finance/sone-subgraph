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

export const FACTORY_ADDRESS = Address.fromString('{{ factory_address }}')

export const LOCKUP_BLOCK_NUMBER = BigInt.fromI32(10959148)

export const MASTER_FARMER_ADDRESS = Address.fromString('{{ masterfarmer_address }}')

export const SONE_TOKEN_ADDRESS = Address.fromString('{{ sone_token_address }}')

export const SONE_USDT_PAIR_ADDRESS = Address.fromString('{{ sone_usdt_pair_address }}')

export const SONE_DISTRIBUTOR_ADDRESS = Address.fromString('{{ sone_distributor_address }}')

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const USDC_WETH_PAIR = '{{ usdc_weth_pair }}'

export const DAI_WETH_PAIR = '{{ dai_weth_pair }}'

export const USDT_WETH_PAIR = '{{ usdt_weth_pair }}'

export const SONE_USDT_PAIR = '{{ sone_usdt_pair }}'

export const UNISWAP_WETH_USDT_PAIR = '{{ sone_usdt_pair }}'

export const UNISWAP_WETH_DAI_PAIR = '{{ sone_usdt_pair }}'

export const UNISWAP_WETH_USDC_PAIR = '{{ sone_usdt_pair }}'

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
export const MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('0')

// minimum liquidity for price to get tracked
export const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('5')

export const WETH_ADDRESS = Address.fromString('{{ weth_address }}')

export const SONESWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('{{ soneswap_weth_usdt_pair_address }}')

export const USDT_ADDRESS = Address.fromString('{{ usdt_address }}')

export const MASTER_FARMER_START_BLOCK = BigInt.fromString('{{master_farmer_start_block}}')

export const UNISWAP_FACTORY_ADDRESS = Address.fromString('{{ uniswap_factory_address }}')

export const UNISWAP_SONE_ETH_PAIR_FIRST_LIQUDITY_BLOCK = BigInt.fromString('{{ uniswap_sone_eth_start_block }}')

export const UNISWAP_WETH_USDT_PAIR_ADDRESS = Address.fromString('{{ uniswap_weth_usdt_pair_address }}')

export const UNISWAP_WETH_DAI_PAIR_ADDRESS = Address.fromString('{{ uniswap_weth_dai_pair_address }}')

export const UNISWAP_WETH_USDC_PAIR_ADDRESS = Address.fromString('{{ uniswap_weth_usdc_pair_address }}')

export const UNISWAP_SONE_ETH_PAIR_ADDRESS = Address.fromString('{{ uniswap_sone_eth_pair_address }}')

export const UNISWAP_SONE_USDT_PAIR_ADDRESS = Address.fromString('{{ uniswap_sone_usdt_pair_address }}')

export const SONE_FACTORY_START_BLOCK = BigInt.fromString('{{sone_factory_start_block}}')

export const SONE_USDT_PAIR_START_BLOCK = BigInt.fromString('{{sone_usdt_pair_start_block}}')