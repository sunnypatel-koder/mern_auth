import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import app from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // You can access the signed-in user information from the result
      const { email, displayName: username, photoURL } = result.user;

      // const response = {
      //   name: username,
      //   email: email,
      //   photoURL: photoURL,
      // };

      // console.log(response);

      const response = await axios.post(
        "http://localhost:3000/api/auth/google",
        {
          name: username,
          email: email,
          photoURL: photoURL,
        }
      );

      if (response.statusText == "OK") {
        navigate("/");
      }

      dispatch(signInSuccess(response.data));

      // Handle server response as needed
      // console.log("Server response:", response.data);
    } catch (error) {
      console.error("Could not login with Google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
