import React, { useState } from 'react'
import InputField from './InputField'

const backendUrl = "https://drawing-app-internship.herokuapp.com"

function LoginAndRegister({ pageType, setPageHandler }) {
    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')

    const [showError, setshowError] = useState("")

    const formSubmitHandler = () => {
        setshowError("");

        if (pageType === "login") {


            if (email === "" || password === "") {
                setshowError("All inputs are required");
            }

            if (email !== "" && password !== "") {
                console.log(email, password)

                fetch(`${backendUrl}/login`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                }).then((res) => res.json())
                    .then(data => {
                        if ("error" in data) {
                            setshowError(data.error)
                        } else {
                            console.log(data)
                            localStorage.setItem("token", data.token)
                            localStorage.setItem("name", data.name)
                            localStorage.setItem("email", data.email)
                            setPageHandler("drawPage")
                        }
                    })
                    .catch(err => {
                        if ("error" in err) setshowError(err.error);
                        else setshowError(err.message)
                    });
            }

        } else {

            if (email === "" || password === "" || name === "" || confirmPassword === "") {
                setshowError("All inputs are required");
            }

            if (email !== "" && password !== "" && name !== "" && confirmPassword !== "") {
                console.log(email, password, name, confirmPassword)

                fetch(`${backendUrl}/register`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                }).then((res) => res.json())
                    .then(data => {
                        if ("error" in data) {
                            setshowError(data.error)
                        } else {
                            console.log(data)
                            localStorage.setItem("token", data.token)
                            localStorage.setItem("name", data.name)
                            localStorage.setItem("email", data.email)
                            setPageHandler("drawPage")
                        }
                    })
                    .catch(err => {
                        if ("error" in err) setshowError(err.error);
                        else setshowError(err.message)
                    });
            }
        }
    }

    const updateValue = (valueFor, value) => {
        switch (valueFor) {
            case "name": setname(value)
                break;
            case "email": setemail(value)
                break;
            case "password": setpassword(value)
                break;
            case "Confirm Password": setconfirmPassword(value)
                break;

            default:
                break;
        }
    }

    // console.log(showError)
    return (
        <div style={{ height: "100%", width: "100%" }}>
            <div style={{ height: "20%", width: "100%", fontSize: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {pageType === "login" ? <div>Login Page</div> : <div>Register Page</div>}
            </div>

            <div style={{ height: "80%", width: "100%", fontSize: "20px", display: "flex", alignItems: "center", flexDirection: "column" }}>
                {
                    pageType === "login" ? null :
                        (
                            <>
                                <InputField fieldName={"name"} value={name} updateValue={updateValue} />
                            </>
                        )
                }


                {/* <div>email</div> */}
                <InputField fieldName={"email"} value={email} updateValue={updateValue} />

                {/* <div>password</div> */}
                <InputField fieldName={"password"} value={password} updateValue={updateValue} />

                {
                    pageType === "login" ? null :
                        (
                            <>
                                <InputField fieldName={"Confirm Password"} value={confirmPassword} updateValue={updateValue} />
                            </>
                        )
                }

                <button onClick={() => formSubmitHandler()} style={{ margin: "20px 0 0 0", padding: "10px 20px" }}>submit</button>

                <div style={{margin: "20px 0 0 0", color:'red'}}>
                    {showError ? <div> {showError} </div> : null}
                </div>
            </div>
        </div>
    )
}

export default LoginAndRegister