"use client"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

function LoginPage() {
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg("")

        const res = await signIn("credentials", {
            email: Email,
            password: Password,
            redirect: false
        })

        setLoading(false)

        if (res?.error) {
            setErrorMsg(res.error || "Login failed")
        } else {
            router.push("/")
        }
    }

    return (
        <div className="p-4 bg-blue-400 mx-auto h-screen">
            <form onSubmit={handleSubmit} className=" w-[550px] space-y-8 h-[450px] mx-auto shadow-2xl p-9 border border-gray-200 rounded-2xl ">
            <h2 className="text-2xl font-bold mb-4 text-center ">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded border-gray-200"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded border-gray-200"
                    required
                />

                {errorMsg && (
                    <p className="text-red-500 text-sm">{errorMsg}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-2 rounded text-white ${
                        loading ? 'bg-red-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    )
}

export default LoginPage
