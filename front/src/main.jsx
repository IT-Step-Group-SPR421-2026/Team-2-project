import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DAppKitProvider, createDAppKit } from '@mysten/dapp-kit-react'
import { SuiGrpcClient } from '@mysten/sui/grpc'
import './global.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

const GRPC_URLS = {
  testnet: 'https://fullnode.testnet.sui.io:443',
}

const dAppKit = createDAppKit({
  networks: ['testnet'],
  createClient(network) {
    return new SuiGrpcClient({ network, baseUrl: GRPC_URLS[network] })
  },
  slushWalletConfig: {
    appName: 'Test flow',
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DAppKitProvider dAppKit={dAppKit}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </DAppKitProvider>
  </StrictMode>,
)
