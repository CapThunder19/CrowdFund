import { useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import Donateabi from "../abi/Crowdfund.json";

export const Withdraw: React.FC<{ contractAddress: string }> = ({ contractAddress }) => {
    const { isConnected } = useAccount();
    const [txHash, setTxHash] = useState("");
    const [withdrawing, setWithdrawing] = useState(false);
    const [message, setMessage] = useState("");

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setWithdrawing(true);
        setMessage("");
        try {
            if (!isConnected) {
                setMessage("Please connect your wallet to withdraw.");
                setWithdrawing(false);
                return;
            }
            const { ethereum } = window;
            if (!ethereum) {
                setMessage("Please install MetaMask.");
                setWithdrawing(false);
                return;
            }
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, Donateabi.abi, signer);
            const tx = await contract.withdrawFunds();
            setTxHash(tx.hash);
            await tx.wait();
            setMessage("Withdraw successful!");
        } catch (err: any) {
            setMessage("Withdraw failed: " + (err?.reason || err?.message || ""));
        }
        setWithdrawing(false);
    };

    return (
        <div className="bg-white bg-opacity-90 shadow-xl rounded-2xl p-8 max-w-md mx-auto mt-12 border border-[#ff3f81]-200">
            <h2 className="text-2xl font-bold text-[#ff3f81]-600 mb-2 text-center">Withdraw</h2>
            <form onSubmit={handleWithdraw} className="flex flex-col gap-4">
                <button
                    type="submit"
                    disabled={withdrawing}
                    className="bg-[#ff3f81] hover:bg-[#ff3f81]-600 text-white px-6 py-2 rounded-lg shadow transition disabled:opacity-50 font-semibold"
                >
                    {withdrawing ? "Processing..." : "Withdraw"}
                </button>
            </form>
            {txHash && (
                <div className="mt-4 text-center">
                    <p className="text-gray-700">Transaction Hash:</p>
                    <a
                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#ff3f81]-600 underline break-all"
                    >
                        {txHash}
                    </a>
                </div>
            )}
            {message && <div className={`mt-2 text-center font-semibold ${message.includes('success') ? 'text-[#ff3f81]-600' : 'text-red-600'}`}>{message}</div>}
        </div>
    );
};