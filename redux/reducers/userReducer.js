const initialState = {
  cart: [],
  userInfo: null,
  shop: '',
  userImg:null

};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_INFO':
      return { ...state, userInfo: action.payload, cart: state.cart || [] };

    case 'CLEAR_USER_INFO':
      return { ...state, userInfo: null };

    case 'SET_SHOP_TYPE':
      return { ...state, shop: action.payload };

   case 'SET_USER_IMAGE':
        return {...state,userImg:action.payload};

  

 

    default:
      return state;
  }
};

export default userReducer;
