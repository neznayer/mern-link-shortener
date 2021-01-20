import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const [form, setForm] = useState({
        email:"",
        password:""
    });
    
    const {loading, request, error, clearError} = useHttp();

    useEffect(() => {
        
        message(error)
        
        clearError()
    }, [error, message,clearError]);

    useEffect(() => {
        window.M.updateTextFields()
    },[])
    //
    function handleChange(event) {
        setForm( {
            ...form,
            [event.target.name]: event.target.value
        })
    }

    async function handleRegister() {
        try {
            const data = await request("/api/auth/register", "POST", {...form})
            message(data.message);
            setForm({
                email:"",
                password:""
            })
        } catch(e) {

        }
    }

    async function handleLogin() {
        try {
            const data = await request("/api/auth/login", "POST", {...form})
            auth.login(data.token, data.userId)
        } catch(e) {

        }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authenticate </span>
                        <p>Login or register</p>
                        <div className="input-field">
                            <input 
                            placeholder="Email" 
                            id="email" type="text" 
                            className="validate" 
                            name="email"
                            onChange={handleChange}
                            value={form.email}
                            />
                            <label htmlFor="email">Enter Email</label>
                        </div>
                        <div className="input-field">
                            <input 
                            placeholder="Password" 
                            id="password" 
                            type="password" 
                            className="validate" 
                            name="password"
                            onChange={handleChange}
                            value={form.password}
                            disabled={loading}
                            />
                            <label htmlFor="password">Enter password</label>
                        </div>
                    </div>
                    <div className="card-action">
                        <button 
                        className="btn waves-effect waves-light red accent-1" 
                        type="submit" 
                        name="login" 
                        style={{marginRight:"10px"}}
                        onClick={handleLogin}
                        > Login</button>
                        <button 
                        className="btn waves-effect waves-light" 
                        type="submit"
                        name="register"
                        onClick={handleRegister}
                        disabled={loading}
                        >Register</button>
                    </div>
                </div>
            </div>
        </div>
    )
}