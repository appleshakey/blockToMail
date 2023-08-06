import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";

export default function Navbar() {
  function handleLogout() {
    const auth = getAuth();
    signOut(auth);
  }
  return (
    <div className="Navbar">
      <h1>BlockToMail</h1>
      <button onClick={handleLogout} className="activity-button">
        Logout
      </button>
    </div>
  );
}
