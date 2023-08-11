export const initialState = {
  product: null,
  errorMessage: null,
  loading: false,
}

export const productReducer = (state, action) => {
  // console.log('product detail dispatched', action)
  switch (action.type) {
    case 'PRODUCT_REQUEST':
      return {
        ...state,
        loading: true,
      }
    case 'GET_PRODUCT_SUCCESS':
      return {
        ...state,
        product: action.payload,
      }
    case 'GET_PRODUCT_DETAIL_SUCCESS':
      return {
        ...state,
        product: action.payload,
      }
    case 'LIKE_PRODUCT_SUCCESS':
      return {
        ...state,
        product: action.payload,
      }
    case 'DISLIKE_PRODUCT_SUCCESS':
      return {
        ...state,
        product: action.payload,
      }
    case 'END_REQUEST':
      return {
        ...state,
        loading: false,
      }
    case 'PRODUCT_ERROR':
      return {
        ...state,
        errorMessage: action.payload,
      }
    default:
      throw new Error()
  }
}
