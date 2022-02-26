
import state from "./state"
import * as getters from "./getters"
import mutations from "./mutations"
import actions from "./actions"

const  storeObj = {
    state,
    getters,
    mutations,
    actions
}

export default storeObj