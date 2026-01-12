import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resendOtp } from "../api/axios";
import Logo from "../components/Logo";

import bgPattern from "../assets/bg-pattern.png"
import runner from "../assets/runner.jpg"

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [demoOtp, setDemoOtp] = useState("");
  const navigate = useNavigate()
  const { verifyOtp } = useAuth()
  const authValue = localStorage.getItem("authValue")

  // Auto-fill OTP if available from login
  useEffect(() => {
    const otpFromLogin = localStorage.getItem("demoOtp")
    if (otpFromLogin) {
      const otpArray = otpFromLogin.split("")
      setOtp(otpArray)
      setDemoOtp(otpFromLogin)
      localStorage.removeItem("demoOtp")
    }
  }, [])

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error when user starts typing
    if (error) {
      setError("");
    }

    // Auto-focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter all digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use AuthContext's verifyOtp which automatically fetches user data
      await verifyOtp(authValue, otpCode);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");

    try {
      const payload = authValue.includes("@") 
        ? { email: authValue } 
        : { phone: authValue };

      const response = await resendOtp(payload);
      
      // Auto-fill new OTP if available
      if (response.data.otp) {
        const otpArray = response.data.otp.split("");
        setOtp(otpArray);
        setDemoOtp(response.data.otp);
      }
      
      setResendTimer(20);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* LEFT SECTION - Decorative with Frame */}
      <div className="hidden lg:flex lg:w-1/2 relative p-8">
        {/* Blue Border Frame */}
        <div className="absolute inset-8  rounded-3xl pointer-events-none z-10"></div>

        {/* Background Pattern Container */}
        <div
          className="flex-1 rounded-3xl overflow-hidden relative"
          style={{
            backgroundImage: `url(${bgPattern})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Logo - Top Left */}
          <div className="absolute top-8 left-8 z-20">
            <Logo size="md" showText={true} textColor="text-[071074]-600" />
          </div>

          {/* Center Card with Runner Image */}
          <div className="relative h-full flex items-center justify-center p-8">
            <div className="relative w-full max-w-xs">
              {/* Card with gradient background and runner image */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600">
                {/* Runner Image */}
                <div className="relative">
                  <img
                    src={runner || "/placeholder.svg"}
                    alt="Runner silhouette"
                    className="w-full h-[380px] object-cover"
                  />

                  {/* Dark gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                    <p className="text-white text-xl font-semibold leading-snug">
                      Uplist your
                      <br />
                      product to market
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="flex lg:hidden mb-8">
            <Logo size="md" showText={true} textColor="text-[071074]-900" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
          <p className="text-gray-600 text-sm mb-8">Enter the 6-digit code sent to {authValue}</p>

         

          <form onSubmit={handleVerifyOtp} className="space-y-8">
            {/* OTP Input Boxes */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-900">Enter OTP</label>
              <div className="flex gap-3 justify-between">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-12 border-2 rounded-lg text-center text-lg font-semibold text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none transition-all ${
                      error
                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
                    placeholder="•"
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#000033] text-white font-semibold rounded-lg hover:bg-[#000055] active:bg-[#000022] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Enter your OTP"}
            </button>
          </form>

          {/* Resend OTP Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm mb-2">Didn't receive OTP?</p>
            {resendTimer > 0 ? (
              <p className="text-gray-500 text-sm">
                Resend in <span className="font-semibold text-blue-600">{resendTimer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-blue-600 font-semibold text-sm hover:underline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? "Resending..." : "Resend"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
