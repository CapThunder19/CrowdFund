import { WalletOption } from "./walletoption";

export function Navbar() {
    return (
        <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
            <h1 className="text-2xl font-bold text-[#ff3f81] hover:text-green-300">Crowd Funding Dapp</h1>
            <WalletOption />
        </nav>
    );
}