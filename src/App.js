import React, { useState } from 'react'
import DrawingHub from './components/DrawingHub';
import LoginAndRegister from './components/LoginAndRegister'

function App() {
    const [pageType, setpageType] = useState("login")

    const setPageHandler = (pageName) => setpageType(pageName);

    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            {
                pageType === "login" || pageType === "register" ?
                    <LoginAndRegister pageType={pageType} setPageHandler={setPageHandler} /> :
                    <DrawingHub />
            }

            {
                pageType === "drawPage" ? null :
                    <div style={{ position: "absolute", top: "5%", right: "5%" }}>
                        {
                            pageType === "login" ?
                                <button onClick={() => setpageType("register")} style={{ padding: "5px 10px" }}>register</button>
                                :
                                <button onClick={() => setpageType("login")} style={{ padding: "5px 10px" }}>login</button>
                        }
                    </div>
            }

            {/* <button onClick={() => setpageType("drawPage")}>draw</button> */}
        </div>
    )
}

export default App