import { logoutUser } from "../api/authApi";
import { cartApi } from "../api/cartApi";

const resetMiddleware = (store) => (next) => (action) => {
  if (logoutUser.fulfilled.match(action)) {
    store.dispatch(cartApi.util.resetApiState());
  }

  return next(action);
};

export default resetMiddleware;
