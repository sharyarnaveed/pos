import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
const Signin = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const usersignin = async (data) => {
    try {
   

      const responce = await axios.post("/api/user/signin", data);
   
      if (responce.data.success) {
       
        toast.success("Login successful", {
          duration: 2000,
        });
        navigate("/");
      } else {
        toast.error(responce.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.log("error in sign in", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign In
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(usersignin)}>
          <div className="rounded-md  space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                {...register("username", { required: "Username is Required" })}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                placeholder="Username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                {...register("password", { required: "Password is Required" })}
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
