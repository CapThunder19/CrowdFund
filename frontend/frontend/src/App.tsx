import './App.css'

import { Navbar } from './components/Navbar';

import { Donate } from './components/Donate';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config';
import { Withdraw } from './components/withdraw';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div>
          <Navbar />
          <Donate contractAddress="0xe047cD944764725fd56555e8Bd5e008631dcd436" />
          <Withdraw contractAddress="0xe047cD944764725fd56555e8Bd5e008631dcd436" />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App
