// userActions.js
export const setUser = (userInfo) => ({
    type: 'SET_USER',
    payload: userInfo,
  });


// logoutAction.js
export const logoutUser = () => ({
    type: 'LOGOUT_USER',
  });

  export const setShopType = (shopType) => ({
    type: 'SET_SHOP_TYPE',
    payload: shopType,
  });