import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        formData
      );
      console.log("Server response:", response.data);

      setLoading(false);
      // if (response.data.error) {
      //   setError(true);
      // }
      setError(false);
      navigate("/sign-in");
    } catch (error) {
      setError(true);
      setLoading(false);
      console.error("Error Submitting", error);
    }
  };

  return (
    <>
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <div className="p-3 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
          <input
            onChange={handleChange}
            type="text"
            placeholder="Username"
            id="username"
            className="bg-slate-100 p-2 rounded-lg"
          />
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
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
        <div className=" flex gap-2 mt-5">
          <p>Have an account?</p>
          <Link to="/sign-in">
            <span className="text-blue-500">Sign in</span>
          </Link>
        </div>
        <p className="text-red-700 mt-5">{error && "Something went wrong!"}</p>
      </div>
    </>
  );
};

export default SignUp;
