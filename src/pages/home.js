import FundSender from "../../components/FundSender";
import CurrentUser from "../../components/CurrentUsers";
import Navbar from "../../components/Navbar";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const app = getAuth();

  useEffect(() => {
    onAuthStateChanged(app, (user) => {
      if (!user) router.push("/");
    });
  }, [app]);

  return (
    <div>
      <Navbar />
      <div className="Home-Top">
        <FundSender className="fund-sender" />
      </div>
      <div>
        <CurrentUser />
      </div>
      <div className="footer">A Initiation By Team melonesk 2023</div>
    </div>
  );
}
