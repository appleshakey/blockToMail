import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default async function signIn(email, password) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (e) {
    console.log(e);
  }
}
