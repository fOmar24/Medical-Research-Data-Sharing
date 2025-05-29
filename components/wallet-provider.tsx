import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';

export function WalletButton() {
  const account = useCurrentAccount();

  return (
    <div>
      {account ? (
        <span>
          Connected: {account.address}
        </span>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}