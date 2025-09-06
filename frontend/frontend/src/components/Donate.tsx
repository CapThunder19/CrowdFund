import type React from 'react';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Donateabi from "../abi/Crowdfund.json";
import { ethers } from 'ethers';

export const Donate: React.FC<{ contractAddress: string }> = ({ contractAddress }) => {
    const { isConnected } = useAccount();
    const [amount, setAmount] = useState('');
    const [donate, setDonate] = useState(false);
    const [txHash, setTxHash] = useState('');
    const [totalFunds, setTotalFunds] = useState('0');
    const [initName, setInitName] = useState('');
    const [initGoal, setInitGoal] = useState('');
    const [initDuration, setInitDuration] = useState('');
    const [initLoading, setInitLoading] = useState(false);
    const [initMsg, setInitMsg] = useState('');
    const [canInitialize, setCanInitialize] = useState(false);

    useEffect(() => {
    const fetchOwner = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) return;
            const provider = new ethers.BrowserProvider(ethereum);
            const contract = new ethers.Contract(contractAddress, Donateabi.abi, provider);
            const owner = await contract.owner();
            setCanInitialize(owner && owner.toLowerCase() === "0x0000000000000000000000000000000000000000");
        } catch {
            setCanInitialize(false);
        }
    };
    fetchOwner();
}, [contractAddress, txHash]);

    useEffect(() => {
        const fetchTotalFunds = async () => {
            try {
                const { ethereum } = window;
                if (!ethereum) return;
                const provider = new ethers.BrowserProvider(ethereum);
                const contract = new ethers.Contract(contractAddress, Donateabi.abi, provider);
                const funds = await contract.totalFunds();
                setTotalFunds(ethers.formatEther(funds));
            } catch (err) {
                setTotalFunds('0');
            }
        };
        fetchTotalFunds();
    }, [txHash, contractAddress]);

    const handledonate = async (e: React.FormEvent) => {
        e.preventDefault();
        setDonate(true);

        try {
            if (!isConnected) {
                alert("Please connect your wallet to donate.");
                setDonate(false);
                return;
            }
            const { ethereum } = window;
            if (!ethereum) {
                alert("Please install MetaMask.");
                setDonate(false);
                return;
            }
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, Donateabi.abi, signer);
            const tx = await contract.contribute({
                value: ethers.parseEther(amount)
            });
            setTxHash(tx.hash);
            await tx.wait();
        } catch (err: any) {
            alert("Donation failed: " + (err?.reason || err?.message || ""));
        }
        setDonate(false);
    };

    const handleInitialize = async (e: React.FormEvent) => {
        e.preventDefault();
        setInitLoading(true);
        setInitMsg("");
        try {
            if (!isConnected) {
                setInitMsg("Connect your wallet to initialize.");
                setInitLoading(false);
                return;
            }
            const { ethereum } = window;
            if (!ethereum) {
                setInitMsg("Please install MetaMask.");
                setInitLoading(false);
                return;
            }
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, Donateabi.abi, signer);
            const tx = await contract.initialize(
                 initName, 
                ethers.parseEther(initGoal), 
                 Number(initDuration) 
                );
            await tx.wait();
            setInitMsg("Initialized successfully!");
        } catch (err: any) {
            setInitMsg("Initialization failed: " + (err?.reason || err?.message || ""));
        }
        setInitLoading(false);
    };

    return (
        <div className="bg-white bg-opacity-90 shadow-xl rounded-2xl p-8 max-w-md mx-auto mt-12 border border-[#ff3f81]-200">
            <h2 className="text-2xl font-bold text-[#ff3f81] mb-2 text-center">Donate</h2>
            <div className="mb-4 text-lg font-semibold text-gray-700 text-center">
                Total Donations: <span className="text-[#ff3f81]-500">{totalFunds} ETH</span>
            </div>
            <form onSubmit={handledonate} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Amount in ETH"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border border-[#ff3f81]-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff3f81]-400 transition"
                />
                <button
                    type="submit"
                    disabled={donate}
                    className="bg-[#ff3f81] hover:bg-[#ff3f81]-600 text-white px-6 py-2 rounded-lg shadow transition disabled:opacity-50 font-semibold"
                >
                    {donate ? "Processing..." : "Donate"}
                </button>
            </form>
            {txHash && (
                <div className="mt-4 text-center">
                    <p className="text-gray-700">Transaction Hash:</p>
                    <a
                        href={`https://etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#ff3f81]-600 underline break-all"
                    >
                        {txHash}
                    </a>
                </div>
            )}
            <hr className="my-8 border-[#ff3f81]-200" />
            <h3 className="text-lg font-bold text-[#ff3f81]-700 mb-2 text-center">Initialize Crowdfund</h3>
            <form onSubmit={handleInitialize} className="flex flex-col gap-3">
                <input
                    type="text"
                    placeholder="Fund Name"
                    value={initName}
                    onChange={e => setInitName(e.target.value)}
                    className="border border-[#ff3f81]-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff3f81]-400 transition"
                    required
                />
                <input
                    type="text"
                    placeholder="Goal in ETH"
                    value={initGoal}
                    onChange={e => setInitGoal(e.target.value)}
                    className="border border-[#ff3f81]-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff3f81]-400 transition"
                    required
                />
                <input
                    type="number"
                    placeholder="Duration (seconds)"
                    value={initDuration}
                    onChange={e => setInitDuration(e.target.value)}
                    className="border border-[#ff3f81]-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff3f81]-400 transition"
                    required
                />
               <button
                 type="submit"
                 disabled={initLoading || !canInitialize}
                   className="bg-[#ff3f81] hover:bg-[#ff3f81]-600 text-white px-6 py-2 rounded-lg shadow transition disabled:opacity-50 font-semibold"
                     >
                   {initLoading ? "Initializing..." : "Initialize"}
                 </button>
                  {!canInitialize && (
              <div className="text-xs text-red-500 mt-1 text-center">
                  You can only initialize after the previous campaign is withdrawn.
              </div>
                )}
            </form>
            {initMsg && <div className={`mt-2 text-center font-semibold ${initMsg.includes('success') ? 'text-[#ff3f81]-600' : 'text-red-600'}`}>{initMsg}</div>}
        </div>
    );
}