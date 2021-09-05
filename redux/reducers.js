import { combineReducers } from "redux";
import { SETMEDIA } from "./actions";

const initialMediaState = {
    videos: [],
    images: [],
    isSetupDirectory: false
}

const mediaReducer = (state = initialMediaState, action) => {
    switch (action.type) {
        case SETMEDIA:
            return {...action.payload, isSetupDirectory: action.isSetupDirectory};
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    media: mediaReducer
})

export default rootReducer
