import { combineReducers } from "redux";
import { SETMEDIA } from "./actions";

const initialMediaState = {
    videos: [],
    images: []
}

const mediaReducer = (state = initialMediaState, action) => {
    switch (action.type) {
        case SETMEDIA:
            // console.log('hi')
            return action.payload;
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    media: mediaReducer
})

export default rootReducer
