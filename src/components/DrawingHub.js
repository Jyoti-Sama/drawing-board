import React, { useState } from 'react'
import Board from './Board'


function DrawingHub() {
    const [isBoardOpen, setisBoardOpen] = useState(false);
    // const [roomId, setroomId] = useState("room1")

    // const onCreate = () => {
    //     setroomId(Date.now());
    //     setisBoardOpen(true);
    // }

    const onJoin = () => {
        setisBoardOpen(true);
    }

    return (
        <>
            {isBoardOpen ?
                <div style={{ height: "100%", width: "100%" }}>
                    <Board roomId={"room1"} />
                </div>
                :
                <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", flexDirection: "column" }}>
                    <div style={{ margin: "50px 0 30px 0", fontSize: "40px"}}>Join board</div>
                    <input value={"room1"} style={{padding:"10px 20px", outline:"none", width:"220px"}}/>
                    <button onClick={() => onJoin()} style={{ margin: "20px 0 0 0", padding: "5px 20px" }}>join</button>
                </div>
            }
        </>
    )
}

export default DrawingHub