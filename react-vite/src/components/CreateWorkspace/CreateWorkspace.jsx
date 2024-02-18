import { useState } from "react"
import { useSelector } from "react-redux"
import './CreateWorkspace.css'
import Cookies from 'js-cookie'


export const CreateWorkspace = () => {
    // const stateData = useSelector(state => state.session.user)
    // console.log(stateData)

    const [name, setName] = useState('')

    const submitForm = async (e) => {
        e.preventDefault()

        try {
            console.log(Cookies)
            await fetch('/api/workspaces', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "csrf_token": Cookies.get("csrf_token")
                },
                body: JSON.stringify({ name })
            })
        } catch (e) {
            let trueE = await e.json()
            console.log(trueE.message)
        }

    }


    return (
        <div id="create-workspace-form-container">
            <form
                onSubmit={e => submitForm(e)}
            >
                <label>
                    name
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    >
                    </input>
                </label>
                <button
                    type="submit"
                >
                    Create Workspace
                </button>
            </form>

        </div>
    )

}
