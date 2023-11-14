import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login_items: [],
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("login reducer works");
      state.login_items = [
        ...state.login_items,
        { id: Date.now(), text: action.payload },
      ];
    },
  },
});

export const { login } = loginSlice.actions;
export default loginSlice.reducer;
