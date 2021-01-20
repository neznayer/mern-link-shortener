import React, { useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";

export const CreatePage = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const {request} = useHttp()
    const [link, setLink] = useState("")

    const handleChange = (e) => {
        setLink(e.target.value)
    } 
    const handleKeyPress = async (e) => {
        if (e.key === "Enter") {
            try {
                const data = await request("/api/link/generate", "POST", {from: link}, {"authorization": `Bearer ${auth.token}`})
                
                history.push(`/detail/${data.link._id}`)
               
            } catch (e) {

            }
        }
    }

    useEffect(() => {
        window.M.updateTextFields()
    },[])

    return (
        <div className = "row">
            <div className="col s8 offset-s2" style={{paddingTop:"2rem"}}>
            <div className="input-field">
                            <input 
                            placeholder="Insert URL here" 
                            id="link" type="text" 
                            className="validate" 
                            name="link"
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            value={link}
                            />
                            <label htmlFor="link">Enter URL</label>
                        </div>
            </div>
            
        </div>
    )
}