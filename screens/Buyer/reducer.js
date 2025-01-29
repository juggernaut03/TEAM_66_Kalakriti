// reducer.js
const initialState = {
    products: [],
    cart: [],
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_PRODUCTS':
        return { ...state, products: action.payload };
      case 'ADD_TO_CART':
        return { ...state, cart: [...state.cart, action.payload] };
      default:
        return state;
    }
  };
  
  export default reducer;