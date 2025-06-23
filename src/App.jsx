import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contract';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(c);

        const message = await c.message();
        setCurrentMessage(message);
      } catch (error) {
        console.error("Connection error:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const updateMessage = async () => {
    if (!contract || !newMessage) return;
    try {
      const tx = await contract.setMessage(newMessage);
      await tx.wait();
      alert("Message updated!");
      const updated = await contract.message();
      setCurrentMessage(updated);
      setNewMessage('');
    } catch (err) {
      console.error("Transaction error:", err);
    }
  };

  return (
    <div className={`App ${darkMode ? 'dark' : 'light'}`}>
      <div className="theme-toggle">
        <button onClick={() => setDarkMode(prev => !prev)}>
          {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>
  
      <div className="center-content">
        <h1>My Web3 DApp</h1>
  
        {!account ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <>
            <p>Connected: {account}</p>
            <h2>Current message:</h2>
            <p>{currentMessage}</p>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter new message"
            />
            <button onClick={updateMessage}>Update Message</button>
          </>
        )}
      </div>
    </div>
  );
  
  
  
}

export default App;


