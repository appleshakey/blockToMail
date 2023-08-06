import { useState, useEffect } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db, auth } from "@/firebase/config";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import contractaddresses from "../constant/contractAddresses.json";
import abi from "../constant/abi.json";
import { ConnectButton } from "web3uikit";

export default function FundSender() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [recommend, setRecommend] = useState([]);
  const [wei, setWei] = useState(0);
  const [addr, setaddr] = useState("");
  const { isWeb3Enabled, chainId: chainIdhex } = useMoralis();
  const chainId = parseInt(chainIdhex);
  const address =
    chainId in contractaddresses ? contractaddresses[chainId][0] : null;
  const dispatch = useNotification();

  const { runContractFunction: ViewAccount } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "getAddr",
    params: { _email: email },
  });

  const {
    runContractFunction: AmountTransaction,
    data: enterTxResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "payToAddr",
    msgValue: wei,
    params: { _addr: addr },
  });

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("email", "asc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetched_emails = [];
      QuerySnapshot.forEach((doc) => {
        fetched_emails.push({ ...doc.data(), id: doc.id });
      });
      let sortedMessages = [];
      fetched_emails.forEach((doc) => sortedMessages.push(doc.email));
      setUsers(sortedMessages);
    });

    return () => unsubscribe;
  }, []);

  useEffect(() => {
    let mails = [];
    let flag = 0;
    if (email) {
      users.forEach((mail) => {
        if (mail === email) flag = -1;
        else if (mail.includes(email)) mails.push(mail);
      });
      if (flag != -1) setRecommend(mails);
      else setRecommend([]);
    }
  }, [email]);

  function handleChange(event) {
    setEmail(event.target.value);
  }

  function setEmailButton(event) {
    setEmail(event.target.value);
  }

  function handleNotification() {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      icon: "bell",
    });
  }

  async function handleSuccess(tx) {
    await tx.wait(1);
    handleNotification();
  }

  async function handleTransaction() {
    await ViewAccount({
      onSuccess: (acc) => setaddr(acc),
      onError: (err) => console.log(err),
    });
    if (addr) {
      await AmountTransaction({
        onSuccess: handleSuccess,
        onError: (err) => console.log(err),
      });
    }
  }

  async function viewAcc() {
    const acc = await ViewAccount({
      onSuccess: (acc) => console.log(acc),
      onError: (e) => console.log(e),
    });
  }

  function handleWeiChange(event) {
    setWei(event.target.value);
  }

  return (
    <div>
      {isWeb3Enabled ? (
        <div className="fund-screen">
          <div className="fund-window">
            <div className="fund-credentials">
              <h1>Transaction window</h1>
              <div>
                <label htmlFor="email">email</label>
              </div>
              <div className="input-field">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => handleChange(event)}
                  placeholder="enter email"
                  required
                />
                {recommend.map((mail) => (
                  <button
                    key={mail}
                    value={mail}
                    onClick={(event) => {
                      setEmailButton(event);
                    }}
                  >
                    {mail}
                  </button>
                ))}
              </div>
              {/* <div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    viewAcc();
                  }}
                >
                  View Account
                </button>
              </div> */}
              <p>Transaction Amount</p>
              <div>
                <input
                  type="number"
                  value={wei}
                  onChange={(event) => handleWeiChange(event)}
                  placeholder="Enter wei"
                />
              </div>
              <div>
                <button
                  onClick={() => {
                    handleTransaction();
                  }}
                  className="activity-button"
                >
                  Transact
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>Please Connect Wallet</h1>
          <ConnectButton moralisAuth={false} />
        </div>
      )}
    </div>
  );
}
