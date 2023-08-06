import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { serverTimestamp, setDoc, doc, getDoc } from "firebase/firestore";

export default async function signIn(email, password, name, account) {
  try {
    const account_presence = await getDoc(doc(db, "users", account));
    console.log(account_presence._document);
    if (account_presence._document === null) {
      let result = await fetch(
        `https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${account}&tag=latest&apikey=2WVE2SJ23RC8DWM8EBHZ5Q2G4DSTKVC8RP`
      );
      result = await result.json();
      if (result.status == 0) {
        console.log("ERROR! Please provide valid account");
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const { uid } = auth.currentUser;
        await setDoc(doc(db, "users", account), {
          email: email,
          user: name,
          account: account,
          logtime: serverTimestamp(),
          uid,
        });
        return res;
      }
    } else {
      console.log("Account already registered with another email");
    }
  } catch (e) {
    console.log(e);
  }
}
