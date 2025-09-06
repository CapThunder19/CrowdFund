# Crowdfunding Dapp

Decentralized crowdfunding dApp — Solidity smart contract (Hardhat) + React frontend (wagmi + ethers).  
Allows initializing a campaign (name, goal, duration), accepting donations, owner withdrawal, and contributor refunds.

---

## Features
- Initialize a campaign: name, goal (ETH), duration (seconds)
- Donate ETH to campaign
- Owner withdraws after deadline (optionally regardless of goal)
- Contributors can refund if goal not reached (after deadline)
- Frontend shows total donations, tx hashes and basic status

---

## Repo layout
- contracts/ — Solidity contract `Crowdfund.sol`
- scripts/ — deployment scripts (Hardhat)
- frontend/frontend/ — React app (components, ABI, UI)

---

## Prerequisites
- Node.js (16+)
- npm
- Hardhat (local dev dependency)
- MetaMask or other injected wallet
- Sepolia testnet funds (faucet)


---

## Usage (frontend)
- Connect wallet (Sepolia account)
- If contract owner is zero address, initialize a campaign (name, goal in ETH, duration in seconds)
- Donors enter ETH amount and click Donate
- After deadline owner can Withdraw (UI shows owner, deadline, and enables withdraw only when allowed)
- If goal not reached, contributors can call Refund (if implemented)

---

License: MIT
