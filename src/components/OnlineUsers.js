import React, { useState } from 'react'

function OnlineUsers({ users }) {
    const [isHidden, setisHidden] = useState(false)
    console.log(users)
    return (
        <>
            <div style={{ position: "absolute", right: '20px', top: "10px" }} onClick={() => setisHidden(!isHidden)}>
                { isHidden ? "users" : "close" }
            </div>

            {isHidden ? null :
                <div style={{ position: "absolute", left: "50%", top: "100px" , transform: "translateX(-50%)", background: "silver", padding: "20px 30px" }}>
                    {
                        users && users.length > 0 && users.length > 0 ? (
                            users.map(user => <div style={{margin:"20px"}}>{user.name}</div>)
                        ) : <div>no user online</div>
                    }
                </div>
            }
        </>
    )
}

export default OnlineUsers