import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(false);

      const response = await axios.post(
        "http://localhost:3000/api/auth/signin",
        formData
      );
      console.log("Server response:", response.data);

      setLoading(false);
      // if (response.data.error) {
      //   setError(true);
      // }
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(true);
      console.error("Error Submitting", error);
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
        <p className="text-red-700 mt-5">{error && "Something went wrong!"}</p>
      </div>
    </>
  );
};

export default SignIn;
