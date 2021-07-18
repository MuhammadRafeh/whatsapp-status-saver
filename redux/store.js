import { applyMiddleware, createStore } from "redux";
// import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import ReduxThunk from 'redux-thunk';

// const store = createStore(rootReducer, composeWithDevTools());
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;
