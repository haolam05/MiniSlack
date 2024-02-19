// import { useState } from "react"
// import './CreateChannel.css'

// export const CreateChannel = () => {

//     const [name, setName] = useState('')
//     const [topic, setTopic] = useState('')
//     const [description, setDescription] = useState('')

//     const submitForm = async (e) => {
//         e.preventDefault()

//         const payload = {
//             name,
//             topic,
//             description
//         }
//     }

//     return (
//         <div id="create-channel-form-container">
//             <form
//                 onSubmit={e => submitForm(e)}
//             >
//                 <label>
//                     name
//                     <input
//                         type="text"
//                         value={name}
//                         onChange={e => setName(e.target.value)}
//                     >
//                     </input>
//                 </label>
//                 <label>
//                     topic
//                     <input
//                         type="text"
//                         value={topic}
//                         onChange={e => setTopic(e.target.value)}
//                     >
//                     </input>
//                 </label>
//                 <label>
//                     description
//                     <input
//                         type="text"
//                         value={description}
//                         onChange={e => setDescription(e.target.value)}
//                     >
//                     </input>
//                 </label>
//                 <button
//                     type="submit"
//                 >
//                     Create Channel
//                 </button>
//             </form>

//         </div>
//     )
// }
