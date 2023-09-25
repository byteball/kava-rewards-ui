import { useState } from "react";

import { AddressPlaceholder, Drawer } from "components";
import { toLocalString } from "utils";

export const BalanceDrawer = ({ children, balances, address }) => {
  const [visible, setVisible] = useState(false);

  return <>
    <span onClick={() => setVisible(true)}>{children}</span>

    <Drawer visible={visible} setVisible={setVisible} title="Balances">
      <div className="py-5">
        {address ? <div className="mb-3">
          Wallet address: <AddressPlaceholder full address={address} />
        </div> : null}

        <table className="w-full">
          <thead className="hidden font-bold text-white md:table-header-group">
            <tr>
              <td>Token</td>
              <td>Balance</td>
              <td>Multiplier</td>
              <td>Effective balance</td>
              <td>Effective USD</td>
            </tr>
          </thead>
          <tbody className="text-white/60">
            {balances.sort((a, b) => b.effective_balance - a.effective_balance).map(({ symbol, effective_balance, balance, asset, home_asset, effective_usd_balance }) => <tr key={symbol} className="flex flex-col py-3 border-b md:py-0 md:table-row md:border-none last:border-none border-b-primary-gray">
              <td><span className="inline text-white md:hidden">Token: </span>{symbol}</td>
              <td><span className="inline text-white md:hidden">Balance: </span>{toLocalString((Number(balance).toFixed(6)))}</td>
              <td><span className="inline text-white md:hidden">Multiplier: </span>{symbol === "LINE" ? "x2" : "x1"}</td>
              <td><span className="inline text-white md:hidden">Effective balance: </span>{toLocalString(Number(effective_balance).toFixed(6))}</td>
              <td><span className="inline text-white md:hidden">Effective USD balance: </span>{toLocalString(Number(effective_usd_balance).toFixed(2))}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </Drawer>
  </>
}
