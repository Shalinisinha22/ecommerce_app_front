import { combineReducers } from 'redux';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  user: userReducer,
  // ... other reducers if any
});

export default rootReducer;