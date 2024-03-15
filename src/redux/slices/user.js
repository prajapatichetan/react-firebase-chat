import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../store";

// define initial state
const initialState = {
  isLoggedIn: false,
  user: {
    email: "",
    accessToken: "",
    displayName: "",
    photoURL: "",
    uid: "",
  },
};

// create slice
const UserSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    //Toggle sidebar
    loggedIn: (state, action) => {
      state.isLoggedIn = true;
      console.log(action.payload);
      state.user = action.payload;
    },
    logOut: (state, action) => {
      state.isLoggedIn = false;
      state.user = initialState.user;
    },
  },
});

// export reducer
export default UserSlice.reducer;

export const { loggedIn, logOut } = UserSlice.actions;
