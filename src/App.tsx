import React, { useState, useEffect, useRef } from 'react';
import { TonConnectUI, ConnectedWallet } from '@tonconnect/ui';
import { beginCell, toNano } from '@ton/core';
import TonWeb from 'tonweb';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';

function App() {
  const [tonConnectUI, setTonConnectUI] = useState<TonConnectUI | null>(null);
  const tonConnectUIRef = useRef<TonConnectUI | null>(null);
  const [result1, setResult1] = useState('');
  const [result2, setResult2] = useState('');
  const [isTestnet, setIsTestnet] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [networkId, setNetworkId] = useState('');

  // Initialize TonConnectUI after component mounts
  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (tonConnectUIRef.current) {
      return;
    }

    const ui = new TonConnectUI({
      manifestUrl: `${BASE_URL}/tonconnect-manifest.json`,
      buttonRootId: 'ton-connect'
    });
    
    tonConnectUIRef.current = ui;
    setTonConnectUI(ui);

    return () => {
      // Cleanup on unmount
      if (tonConnectUIRef.current) {
        try {
          // Only disconnect if wallet is connected
          if (tonConnectUIRef.current.wallet) {
            tonConnectUIRef.current.disconnect();
          }
        } catch (error) {
          console.log('Cleanup error (safe to ignore):', error);
        }
        tonConnectUIRef.current = null;
      }
    };
  }, []);

  // Subscribe to wallet connection events
  useEffect(() => {
    if (!tonConnectUI) return;

    const unsubscribe = tonConnectUI.onStatusChange((wallet: ConnectedWallet | null) => {
      console.log('Wallet status changed:', wallet);
      
      if (wallet) {
        const network = wallet.account.chain === '-3' ? 'testnet' : 'mainnet';
        const status = `Connected to ${network}. Network: ${wallet.account.chain}, Address: ${wallet.account.address}`;
        console.log(status);
        
        setConnectionStatus(status);
        setWalletAddress(wallet.account.address);
        setNetworkId(wallet.account.chain);
        setIsTestnet(wallet.account.chain === '-3');
      } else {
        console.log('Wallet disconnected');
        setConnectionStatus('Not connected');
        setWalletAddress('');
        setNetworkId('');
        setIsTestnet(false);
      }
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, [tonConnectUI]);

  const sendWithTonCore = async () => {
    try {
      if (!tonConnectUI) {
        throw new Error('TonConnect UI not initialized');
      }

      const wallet = tonConnectUI.wallet;
      if (!wallet) {
        throw new Error('Please connect your wallet first');
      }

      console.log('Sending with @ton/ton. Wallet:', wallet);

      if (wallet.account.chain !== '-3') {
        throw new Error('Please switch to testnet in your wallet');
      }

      const msg = "Hello, TON!";
      const payload = beginCell()
        .storeUint(0, 32) // op = 0
        .storeStringTail(msg)
        .endCell()
        .toBoc()
        .toString('base64');

      console.log('@ton/ton payload:', payload);

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: wallet.account.address,
            amount: toNano('0.01').toString(),
            payload
          }
        ]
      };

      console.log('Sending transaction:', transaction);
      const result = await tonConnectUI.sendTransaction(transaction);
      console.log('Transaction result:', result);
      setResult1(`@ton/ton Transaction sent: ${result.boc}`);
    } catch (e: any) {
      console.error('@ton/ton error:', e);
      setResult1(`@ton/ton Error: ${e.message}`);
    }
  };

  const sendWithTonWeb = async () => {
    try {
      if (!tonConnectUI) {
        throw new Error('TonConnect UI not initialized');
      }

      const wallet = tonConnectUI.wallet;
      if (!wallet) {
        throw new Error('Please connect your wallet first');
      }

      console.log('Sending with tonweb. Wallet:', wallet);

      if (wallet.account.chain !== '-3') {
        throw new Error('Please switch to testnet in your wallet');
      }

      const msg = "Hello, TON!";
      const tonweb = new TonWeb();
      
      // Create a proper cell structure using TonWeb's cell builder
      const cell = new tonweb.boc.Cell();
      cell.bits.writeUint(0, 32); // op = 0
      cell.bits.writeString(msg);
      
      const payload = tonweb.utils.bytesToBase64(await cell.toBoc());
      console.log('tonweb payload:', payload);

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: wallet.account.address,
            amount: toNano('0.01').toString(),
            payload
          }
        ]
      };

      console.log('Sending transaction:', transaction);
      const result = await tonConnectUI.sendTransaction(transaction);
      console.log('Transaction result:', result);
      setResult2(`tonweb Transaction sent: ${result.boc}`);
    } catch (e: any) {
      console.error('tonweb error:', e);
      setResult2(`tonweb Error: ${e.message}`);
    }
  };

  const isWalletConnected = tonConnectUI?.wallet !== null;
  const canSendTransaction = isWalletConnected && isTestnet;

  return (
    <div style={{ padding: 20 }}>
      <h1>TON SDK Compare</h1>
      <div id="ton-connect"></div>
      <div style={{ marginTop: 20 }}>
        <button 
          onClick={sendWithTonCore} 
          style={{ marginRight: 10 }}
          disabled={!canSendTransaction}
        >
          Send with @ton/ton
        </button>
        <button 
          onClick={sendWithTonWeb}
          disabled={!canSendTransaction}
        >
          Send with tonweb
        </button>
      </div>
      <div style={{ marginTop: 20 }}>
        <p>{result1}</p>
        <p>{result2}</p>
      </div>
      <div style={{ marginTop: 20 }}>
        <p>Connection status: {connectionStatus}</p>
        {isWalletConnected && (
          <>
            <p>Wallet address: {walletAddress}</p>
            <p>Network: {isTestnet ? 'testnet' : 'mainnet'}</p>
            <p>Network ID: {networkId}</p>
            <p>Buttons enabled: {canSendTransaction ? 'Yes' : 'No'}</p>
            {!isTestnet && (
              <p style={{ color: 'red' }}>Please switch to testnet in your wallet to send transactions</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App; 