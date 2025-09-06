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
          <Donate contractAddress="0xf91C5A45E83523a11f86D75f58512708E6361111" />
          <Withdraw contractAddress="0xf91C5A45E83523a11f86D75f58512708E6361111" />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App
