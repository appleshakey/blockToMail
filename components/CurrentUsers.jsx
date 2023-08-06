import { query, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";

export default function CurrentUser() {
  const [users, setUsers] = useState(0);
  useEffect(() => {
    const q = query(collection(db, "users"));

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let count = 0;
      QuerySnapshot.forEach((doc) => {
        count += 1;
      });
      setUsers(count);
    });
    return () => unsubscribe;
  }, []);
  return (
    <div className="Home-bottom">
      <div className="count-window">
        <h2>Currently {users} users </h2>
        <h4>and Growing!!!!!!</h4>
      </div>
      <div className="Home-passage">
        <h2>Making Transactions Easier</h2>
        <p>
          By creating a decentralized storage smart-contract, Our webstie
          application facilitates the transaction. Simply Search for email
          address you want to send eth to and send them your ether just like
          that. No more remembering addressess and or afraid of entering wrong
          addresses. Also be comfortable as your datas are stored in
          decentralized app, so no need of worrying about data loss and
          security. Happy Transactions!!!!! Under the Hood, This webApp uses
          smart-contract storage. Once you register, your emailId is mapped with
          the wallet address. So, any user registered in this app will be able
          to send ethereum to you through this app and you will recieve it
          FLAWLESSLY!!!!!.
        </p>
      </div>
    </div>
  );
}
