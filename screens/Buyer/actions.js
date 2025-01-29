// actions.js
export const fetchProducts = () => {
    return async (dispatch) => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        dispatch({ type: 'FETCH_PRODUCTS', payload: data });
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  };
  
  export const addToCart = (product) => {
    return { type: 'ADD_TO_CART', payload: product };
  };