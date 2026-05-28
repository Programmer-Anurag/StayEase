import { useState } from "react";
import { BaseUrl } from "../../services/api";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

export default function LoginForm() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${BaseUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(loginData)
            });

            const data = await res.json();
            if (data.error) {
                toast.warning(data.error);
            } else { 
                localStorage.setItem("token", data.token);
                toast.success(data.success || "Logged in successfully!");
                
                const reqUrl = localStorage.getItem("req_URL");
                if (reqUrl) {
                    navigate(reqUrl);
                    localStorage.removeItem("req_URL");
                } else {
                    navigate("/listings");
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong. Please check your credentials.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Left side: Beautiful image panel */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200" 
                    alt="Premium luxury hotel lobby" 
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-xs flex flex-col justify-end p-12 text-white">
                    <h2 className="text-4xl font-extrabold font-display leading-tight">Your gateway to luxury stays & cozy retreats.</h2>
                    <p className="mt-4 text-slate-200 max-w-md">Join over 10 million travelers discovering unique local stays and experiencing premium hospitality around the world.</p>
                </div>
            </div>

            {/* Right side: Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-white">
                <div className="mx-auto w-full max-w-md">
                    <div className="text-center lg:text-left mb-10">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6 group justify-center lg:justify-start">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                            </div>
                            <span className="font-display font-bold text-lg text-slate-900">StayEase</span>
                        </Link>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">Welcome Back</h2>
                        <p className="mt-2 text-sm text-slate-500">Sign in to manage your bookings and explore deals.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="name@domain.com"
                                disabled={submitting}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                className="block w-full rounded-xl border border-slate-300/80 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Password
                                </label>
                                <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                disabled={submitting}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                className="block w-full rounded-xl border border-slate-300/80 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex w-full justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                            >
                                {submitting ? "Signing in..." : "Login"}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Not a member?{' '}
                        <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}







