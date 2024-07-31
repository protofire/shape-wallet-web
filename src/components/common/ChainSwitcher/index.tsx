import type { ReactElement } from 'react'
import { useCallback, useState } from 'react'
import { Box, Button, CircularProgress } from '@mui/material'
import { useCurrentChain } from '@/hooks/useChains'
import useOnboard from '@/hooks/wallets/useOnboard'
import useIsWrongChain from '@/hooks/useIsWrongChain'
import css from './styles.module.css'
import { switchWalletChain } from '@/services/tx/tx-sender/sdk'

const ChainSwitcher = ({
  fullWidth,
  size = 'small',
  contained = false,
}: {
  fullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
  contained?: boolean
}): ReactElement | null => {
  const chain = useCurrentChain()
  const onboard = useOnboard()
  const isWrongChain = useIsWrongChain()
  const [loading, setIsLoading] = useState<boolean>(false)

  const handleChainSwitch = useCallback(async () => {
    if (!onboard || !chain) return
    setIsLoading(true)
    await switchWalletChain(onboard, chain.chainId)
    setIsLoading(false)
  }, [chain, onboard])

  if (!isWrongChain) return null

  return (
    <Button
      onClick={handleChainSwitch}
      variant={contained ? 'contained' : 'outlined'}
      sx={{ minWidth: '200px' }}
      size={size}
      fullWidth={fullWidth}
      color="primary"
      disabled={loading}
    >
      {loading ? (
        <CircularProgress size={20} />
      ) : (
        <>
          Switch to&nbsp;
          <Box className={css.circle} bgcolor={chain?.theme?.backgroundColor || ''} />
          &nbsp;{chain?.chainName}
        </>
      )}
    </Button>
  )
}

export default ChainSwitcher
