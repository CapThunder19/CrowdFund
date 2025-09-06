import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import Donateabi from "../abi/Crowdfund.json";

export const Withdraw: React.FC<{ contractAddress: string }> = ({ contractAddress }) => {
    const { address, isConnected } = useAccount();
    const [txHash, setTxHash] = useState("");
    const [withdrawing, setWithdrawing] = useState(false);
    const [message, setMessage] = useState("");
    const [canWithdraw, setCanWithdraw] = useState(false);
    const [owner, setOwner] = useState<string | null>(null);
    const [deadline, setDeadline] = useState<number | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                console.log("Fetching contract status for", contractAddress);
                const { ethereum } = window;
                if (!ethereum) {
                    console.warn("No window.ethereum");
                    setOwner(null);
                    setCanWithdraw(false);
                    return;
                }
                const provider = new ethers.BrowserProvider(ethereum);
                const contract = new ethers.Contract(contractAddress, Donateabi.abi, provider);
                const _owner = await contract.owner();
                const _deadline = await contract.deadline();
                console.log("Fetched owner:", _owner, "deadline:", _deadline?.toString?.());
                setOwner(_owner || null);
                setDeadline(_deadline ? Number(_deadline) : null);

                const now = Math.floor(Date.now() / 1000);
                const ownerLower = _owner ? String(_owner).toLowerCase() : "";
                setCanWithdraw(
                    ownerLower !== "" &&
                    now >= Number(_deadline || 0) &&
                    address?.toLowerCase() === ownerLower
                );
            } catch (err) {
                console.error("fetchStatus error:", err);
                setOwner(null);
                setDeadline(null);
                setCanWithdraw(false);
            }
        };
        fetchStatus();
    }, [address, contractAddress, txHash]);

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setWithdrawing(true);
        setMessage("");
        try {
            if (!isConnected) { setMessage("Connect wallet"); setWithdrawing(false); return; }
            const { ethereum } = window;
            if (!ethereum) { setMessage("Install MetaMask"); setWithdrawing(false); return; }
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, Donateabi.abi, signer);
            const tx = await contract.withdrawFunds();
            setTxHash(tx.hash);
            await tx.wait();
            setMessage("Withdraw successful");
        } catch (err: any) {
            console.error("withdraw error:", err);
            setMessage("Withdraw failed: " + (err?.reason || err?.message || ""));
        }
        setWithdrawing(false);
    };

    return (
        <div className="bg-white bg-opacity-90 shadow-xl rounded-2xl p-8 max-w-md mx-auto mt-12 border border-[#ff3f81]-200">
            <h2 className="text-2xl font-bold text-[#ff3f81] mb-2 text-center">Withdraw</h2>
            <div className="text-sm text-gray-600">
                <div>Connected: {address ?? "Not connected"}</div>
                <div>Owner (raw): {owner ?? "null/failed to fetch"}</div>
                <div>Deadline: {deadline ? `${deadline} (${new Date(deadline*1000).toLocaleString()})` : "Not set"}</div>
            </div>

            <form onSubmit={handleWithdraw} className="flex flex-col gap-4">
                <button disabled={!canWithdraw || withdrawing} className="bg-[#ff3f81] px-4 py-2 rounded text-white">
                    {withdrawing ? "Processing..." : "Withdraw"}
                </button>
            </form>

            {txHash && <div className="mt-3">TX: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">{txHash}</a></div>}
            {message && <div className="mt-2 text-sm">{message}</div>}
            {!canWithdraw && <div className="mt-2 text-xs text-yellow-600">Withdraw available to owner after deadline.</div>}
        </div>
    );
};