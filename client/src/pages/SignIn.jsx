import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const SignIn = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());

      const response = await axios.post(
        "http://localhost:3000/api/auth/signin",
        formData
      );
      console.log("Server response:", response.data);

      if (response.statusText == "OK") {
        dispatch(signInSuccess(response.data));
      }

      navigate("/");
    } catch (error) {
      console.error("Error Submitting", error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data.message;
        console.log("Server Error Status:", error.response.status);
        console.log("Server Error Message:", errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        console.log("No response received from the server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error Message:", error.message);
      }

      dispatch(signInFailure(error.response.data.message));
    }
  };

  return (
    <>
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <div className="p-3 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
          <input
            onChange={handleChange}
            type="email"
            placeholder="Email"
            id="email"
            className="bg-slate-100 p-2 rounded-lg"
          />
          <input
            onChange={handleChange}
            type="text"
            placeholder="Password"
            id="password"
            className="bg-slate-100 p-2 rounded-lg"
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
        <div className=" flex gap-2 mt-5">
          <p>Don&apos;t have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-500">Sign up</span>
          </Link>
        </div>
        <p className="text-red-700 mt-5">
          {error ? (
            <>
              <pre>{JSON.stringify(error, null, 2)}</pre>
              {error.response?.data?.message && "Something went wrong!"}
            </>
          ) : (
            ""
          )}
        </p>
      </div>
    </>
  );
};

export default SignIn;
