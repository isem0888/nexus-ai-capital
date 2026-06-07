"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function ConnectWallet() {
  return (
    <div className="mt-8">
      <ConnectButton
        showBalance={false}
        accountStatus="address"
      />
    </div>
  );
}