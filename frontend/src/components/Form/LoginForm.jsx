import { useState } from "react";
import { BaseUrl } from "../../services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


export default function LoginForm() {
    const navigate=useNavigate();
    const [LoginData,setLoginData]=useState({
        email:"",
        password:""
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
               const token=localStorage.getItem("token");
                const res = await fetch(`${BaseUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(LoginData)
            });
            console.log(res);
            

            const data = await res.json();
            console.log(data);
            if(data.error){
                toast.warning(data.error)
            }

            else{ 
                localStorage.setItem("token", data.token);
                toast.success(data.success);
                if(localStorage.getItem("req_URL")){
                    
                    navigate("/new");
                    localStorage.removeItem("req_URL");
                }
            }
               
        } catch (err) {
            console.log(err);
            
            
            toast.warning("something went wrong")
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-700">Sign in to your account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    onChange={(e)=>{
                                        setLoginData(
                                            {
                                                ...LoginData,
                                                email:e.target.value
                                            }
                                        )}} 
                                        />

                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    onChange={(e)=>{
                                        setLoginData(
                                            {
                                                ...LoginData,
                                                password:e.target.value
                                            }
                                        )}}
                                    />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-400">
                        Not a member?{' '}
                        <a href="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300">
                            SignUp
                        </a>
                    </p>
                </div>
            </div>

        </>
    );
}







