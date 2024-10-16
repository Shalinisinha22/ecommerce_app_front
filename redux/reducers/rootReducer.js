import { combineReducers } from 'redux';
import userReducer from "./userReducer";
import cartReducer from './cartReducer';
import shopReducer from './shopReducer';

const rootReducer = combineReducers({
  user: userReducer,
  cart:cartReducer,
  shop:shopReducer

  // ... other reducers if any
});

export default rootReducer;