const initialState = {
  cart: [],
  userInfo: null,
  shop: ''

};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_INFO':
      return { ...state, userInfo: action.payload, cart: state.cart || [] };

    case 'CLEAR_USER_INFO':
      return { ...state, userInfo: null };

    case 'SET_SHOP_TYPE':
      return { ...state, shop: action.payload };

  

 

    default:
      return state;
  }
};

export default userReducer;
