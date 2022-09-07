import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

function EventWatch({allUsers}) {
    const socket = io("http://localhost:5000")
    const [popup, setpopup] = useState('')

    useEffect(() => {
        socket.emit("join-room2", "nothing")
    })

    useEffect(() => {
        socket.on("joinroom", (data) => {
            let roomDetails = data.room1Details;
            allUsers(roomDetails)

            setpopup(data.data.name + " joined")
            setTimeout(() => setpopup(""), 5000)
        })

        socket.on("user-left", (data) => {

            allUsers(data.room1Details)

            setpopup(data.leftuser.name + " left")
            setTimeout(() => setpopup(""), 5000)
        })

        socket.on('drawing-data-to-client', (name) => {
            setpopup(name + " drew")
            setTimeout(() => setpopup(""), 5000)
        })

    }, [socket])



    return (
        <>
            {
                popup === "" ? null :
                    <div style={{ position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)", background: "#95ff95", borderRadius: "8px", padding: "10px 20px" }}>{popup}</div>
            }
        </>
    )
}

export default EventWatch