"use client";
import { useState } from "react";
import signIn from "@/auth/signIn";
import signUp from "@/auth/signUp";
import { useRouter } from "next/router";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useMoralis, useWeb3Contract } from "react-moralis";
import contractaddresses from "../constant/contractAddresses.json";
import abi from "../constant/abi.json";
import { useNotification } from "web3uikit";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [isRegistration, setIsRegistration] = useState(false);
  const { chainId: chainIdhex } = useMoralis();
  const chainId = parseInt(chainIdhex);
  const address =
    chainId in contractaddresses ? contractaddresses[chainId][0] : null;
  const dispatch = useNotification();
  const {
    runContractFunction: emailToAddr,
    data: enterTxResponse,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "storeEmailtoAddr",
    params: { _email: email, _addr: account },
  });

  async function handleRegister() {
    const res = await signUp(email, password, name, account);
    if (res) {
      const handleNotification = async () => {
        dispatch({
          type: "info",
          message: "Transaction Complete!",
          title: "Transaction Notification",
          position: "topR",
          icon: "bell",
        });
      };

      const handleSuccess = async (tx) => {
        await tx.wait(1);
        handleNotification();
      };

      await emailToAddr({
        onSuccess: handleSuccess,
        onError: (err) => console.log(err),
      });
    }
    setEmail("");
    setPassword("");
    setAccount("");
    setName("");
  }

  async function handleLogin() {
    const user = await signIn(email, password);
    if (user) router.push("/home");
    console.log("login clicked");
    setEmail("");
    setPassword("");
  }

  return (
    <div>
      {isRegistration ? (
        <div className="log-box">
          <h1>Registration</h1>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleRegister();
            }}
          >
            <div className="log-form">
              <div className="email">
                <label htmlFor="email-address">email</label>
                <input
                  type="email"
                  label="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email"
                  required
                />
              </div>
              <div className="password">
                <label htmlFor="password">password</label>
                <input
                  type="password"
                  label="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  placeholder="password"
                  required
                />
              </div>
              <div className="name">
                <label htmlFor="name">name</label>
                <input
                  type="text"
                  label="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="name"
                  required
                />
              </div>
              <div className="account">
                <label htmlFor="account">account</label>
                <input
                  type="text"
                  label="name"
                  value={account}
                  onChange={(event) => setAccount(event.target.value)}
                  placeholder="account"
                  required
                />
              </div>
            </div>
            <div className="submit">
              <button type="submit">Register</button>
            </div>
          </form>
          <button onClick={() => setIsRegistration(!isRegistration)}>
            Already Have Account?
          </button>
        </div>
      ) : (
        <div className="log-box">
          <h1>Sign In</h1>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleLogin();
            }}
          >
            <div className="log-form">
              <div className="email">
                <label htmlFor="email-address">email</label>
                <input
                  type="email"
                  label="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email"
                  required
                />
              </div>
              <div className="password">
                <label htmlFor="password">password</label>
                <input
                  type="password"
                  label="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="password"
                  required
                />
              </div>
            </div>
            <div className="submit">
              <button type="submit">Login</button>
            </div>
          </form>
          <button onClick={() => setIsRegistration(!isRegistration)}>
            Don't have account?
          </button>
        </div>
      )}
    </div>
  );
}
