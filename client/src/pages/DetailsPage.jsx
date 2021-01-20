import React, { useCallback, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { LinkCard } from "../components/LinkCard"
import { Loader } from "../components/Loader"
import { AuthContext } from "../context/AuthContext"
import { useHttp } from "../hooks/http.hook"

export const DetailsPage = () => {
    const {request, loading} = useHttp()
    const {token} = useContext(AuthContext)
    const [link, setLink] = useState(null)
    const linkId = useParams().id

    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/${linkId}`,"GET", null, {
                authorization: `Bearer ${token}`
            })
            setLink(fetched)
        } catch (e) {

        }
    },[token, linkId, request])

useEffect(()=> {
    getLink()
}, [getLink])

if (loading) {
    return <Loader/>
}
    return (
        <div>
            {!loading && link && <LinkCard link = {link}/>}
        </div>
    )
}