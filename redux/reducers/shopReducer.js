// shopReducer.js
const initialState = {
    shop: null,
  };
  
  const shopReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_SHOP_TYPE':
        return {
          ...state,
          shop: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default shopReducer;
  