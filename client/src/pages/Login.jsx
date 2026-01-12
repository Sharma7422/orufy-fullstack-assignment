"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { sendOtp } from "../api/axios"
import Logo from "../components/Logo"

import bgPattern from "../assets/bg-pattern.png"
import runner from "../assets/runner.jpg"

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [demoOtp, setDemoOtp] = useState("")
  const [signupData, setSignupData] = useState({
    email: "",
    phone: "",
  })
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setDemoOtp("")

    try {
      const payload = value.includes("@") ? { email: value } : { phone: value }

      const response = await sendOtp(payload)
      
      // Show OTP if available (dev/demo mode)
      if (response.data.otp) {
        setDemoOtp(response.data.otp)
        localStorage.setItem("demoOtp", response.data.otp)
      }
      
      localStorage.setItem("authValue", value)
      navigate("/verify-otp", { state: payload })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!signupData.email && !signupData.phone) {
      setError("Email or Phone number is required")
      return
    }

    setLoading(true)
    try {
      const payload = signupData.email ? { email: signupData.email } : { phone: signupData.phone }
      const authValue = signupData.email || signupData.phone
      
      const response = await sendOtp(payload)
      
      if (response.data.otp) {
        setDemoOtp(response.data.otp)
        localStorage.setItem("demoOtp", response.data.otp)
      }
      
      localStorage.setItem("authValue", authValue)
      navigate("/verify-otp", { state: payload })
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignup(!isSignup)
    setError("")
    setValue("")
    setDemoOtp("")
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {}
      <div className="hidden lg:flex lg:w-1/2 relative p-8">
        {}
        <div className="absolute inset-8  rounded-3xl pointer-events-none z-10"></div>

        {}
        <div
          className="flex-1 rounded-3xl overflow-hidden relative"
          style={{
            backgroundImage: `url(${bgPattern})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {}
          <div className="absolute top-8 left-8 z-20">
            <Logo size="md" showText={true} textColor="text-[071074]-600" />
          </div>

          {}
          <div className="relative h-full flex items-center justify-center p-8">
            <div className="relative w-full max-w-xs">
              {}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600">
                {}
                <div className="relative">
                  <img
                    src={runner || "/placeholder.svg"}
                    alt="Runner silhouette"
                    className="w-full h-[380px] object-cover"
                  />

                  {}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {}
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

      {}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-sm">
          {}
          <div className="flex lg:hidden mb-8">
            <Logo size="md" showText={true} textColor="text-[071074]-900" />
          </div>

          {!isSignup ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Login to your Productr Account</h1>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Email or Phone number</label>
                  <input
                    type="text"
                    placeholder="Enter email or phone number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {}
                {demoOtp && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-600 text-sm font-medium mb-1">📧 Demo OTP (for testing):</p>
                    <p className="text-blue-700 text-lg font-bold tracking-widest">{demoOtp}</p>
                    <p className="text-blue-500 text-xs mt-2">This OTP will be auto-filled on the next page</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#000033] text-white font-semibold rounded-lg hover:bg-[#000055] active:bg-[#000022] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending OTP..." : "Login"}
                </button>
              </form>

              {}
              <div className="mt-12 border border-gray-200 rounded-xl py-6 px-6 text-center bg-white shadow-sm">
                <p className="text-gray-600 text-sm mb-2">Don't have a Productr Account</p>
                <button
                  onClick={toggleMode}
                  className="text-[#000033] font-semibold text-sm hover:underline focus:outline-none"
                >
                  SignUp Here
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Your Account</h1>

              <form onSubmit={handleSignupSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={signupData.phone}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {}
                {demoOtp && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-600 text-sm font-medium mb-1">📧 Demo OTP (for testing):</p>
                    <p className="text-blue-700 text-lg font-bold tracking-widest">{demoOtp}</p>
                    <p className="text-blue-500 text-xs mt-2">This OTP will be auto-filled on the next page</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#000033] text-white font-semibold rounded-lg hover:bg-[#000055] active:bg-[#000022] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending OTP..." : "Sign Up"}
                </button>
              </form>

              {}
              <div className="mt-12 border border-gray-200 rounded-xl py-6 px-6 text-center bg-white shadow-sm">
                <p className="text-gray-600 text-sm mb-2">Already have a Productr Account?</p>
                <button
                  onClick={toggleMode}
                  className="text-[#000033] font-semibold text-sm hover:underline focus:outline-none"
                >
                  Login Here
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
