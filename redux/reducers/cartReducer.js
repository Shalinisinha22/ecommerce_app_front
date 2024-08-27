const initialCartState = {
    cart: [], // Initialize the cart as an empty array
  };
  
  const cartReducer = (state = initialCartState, action) => {
    switch (action.type) {
      case 'ADD_TO_CART': {
        const isPresent = state.cart.find(product => product.id === action.payload.id);
  
        return {
          ...state,
          cart: isPresent
            ? state.cart.map(product =>
                product.pcode === action.payload.id
                  ? { ...product, qty: product.qty + 1 }
                  : product
              )
            : [...state.cart, { ...action.payload.item, qty: 1 }],
        };
      }

      case 'HANDLE_INCREMENT':
        const product = state.cart.find((product) => product.pcode === action.payload);
        if(product.cart_limit == product.qty){
             return{...state,cart:state.cart}
        }
        let newArr=state.cart.map((product)=>product.pcode==action.payload?{...product,qty:product.qty + 1}:product)
  

        return{
            ...state,
         cart:state.cart.map((product)=>product.pcode==action.payload?{...product,qty:product.qty + 1}:product)
        }

        case 'HANDLE_DECREMENT':
            const prod = state.cart.find((product) => product.pcode === action.payload);
          
            if (prod.qty > 1) {
              let newArr = state.cart.map((product) =>
                product.pcode === action.payload
                  ? { ...product, qty: product.qty - 1 }
                  : product
              );
              return {
                ...state,
                cart: newArr,
              };
            } else if (prod.qty === 1) {
              return {
                ...state,
                cart: state.cart.filter((product) => product.pcode !== action.payload),
              };
            }
          
            return state; // Return the current state by default if no conditions are met
          


         
      case 'REMOVE_FROM_CART':
        return {
          ...state,
          cart: state.cart.filter(product => product.pcode !== action.payload),
        };
  
      case 'UPDATE_QTY':
        return {
          ...state,
          cart: state.cart.map(product =>
            product.pcode === action.payload.id
              ? { ...product, qty: action.payload.qty }
              : product
          ),
        };
  
      default:
        return state;
    }
  };
  
  export default cartReducer;
  