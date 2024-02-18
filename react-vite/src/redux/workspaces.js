

//action type
const CREATE_WORKSPACE = 'worksapces/CREATE_WORKSPACE'

//action creator
export const createWorkspace = (payload) => ({
    type: CREATE_WORKSPACE,
    payload
})


//thunk creator 
// export const createSpotsThunk = () => async (dispatch) => {
// }