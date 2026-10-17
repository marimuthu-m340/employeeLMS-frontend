import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./api/authApi";
import { useAuth } from "./context/AuthContext.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
      setIsLoading(true);

    }
    console.log("PASSWORD FROM INPUT:", password);
    try {
     const response = await loginUser(email, password);

     console.log(
  "LOGIN USER DATA:",
  response.data.data.user
);

      if (response.data.success) {
        login(
            response.data.data.user,
            response.data.token
        );

        toast.success("Login Successfully");
      
  const userRole = response.data.data.user.role;

  setTimeout(() => {
  switch (userRole) {
    case "SUPER_ADMIN":
      navigate("/admin");
      break;

    case "HR":
      navigate("/hr");
      break;

    case "MANAGER":
    case "MANAGER_ADMIN":
    navigate("/manager");
    break;

    case "EMPLOYEE":
    navigate("/employee");
    break;

    default:
      toast.error("Invalid user role");
      break;
  }
}, 1000);
}
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unable to connect to server");
      }
    }finally {
  setIsLoading(false);
}
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* Left Side */}
        <div className="login-left">
          <div className="brand">
            Employee LMS
          </div>

          <h1>
            Welcome Back!
          </h1>

          <p>
            Manage your employees, track attendance,
            and manage your organization easily.
          </p>

          <div className="features">

            <div className="feature">
              <span>✓</span>
              Employee Management
            </div>

            <div className="feature">
              <span>✓</span>
              Attendance Tracking
            </div>

            <div className="feature">
              <span>✓</span>
              Secure & Reliable
            </div>

          </div>
        </div>

        {/* Right Side */}
        <div className="login-right">

          <h2>Login</h2>

          <p className="login-subtitle">
            Login to access your Employee LMS account
          </p>

          <form onSubmit={handleLogin}>

            <div className="input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

           <div className="input-group">
  <label>Password</label>

  <div className="password-input-wrapper">

    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      type="button"
      className="password-eye-btn"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>

  </div>

</div>
           <button
  type="submit"
  className="login-button"
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <span className="login-spinner"></span>
      Logging in...
    </>
  ) : (
    "Login"
  )}
</button>

          </form>

        </div>

      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

    </div>
  );
};

export default Login;