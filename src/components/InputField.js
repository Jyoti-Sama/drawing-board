import React from 'react'

function InputField({fieldName, value, updateValue}) {

    // const [valueErr, setvalueErr] = useState(false)

    return (
        <div style={{margin:"20px 20px"}}>
            <input
                style={{padding:"10px 20px", outline:"none", width:"220px"}}
                value={value}
                placeholder={fieldName}
                onChange={(e) => updateValue(fieldName, e.target.value)}
                // style={{borderColor: valueErr ? "red" : "black"}}
            />
        </div>
    )
}

export default InputField