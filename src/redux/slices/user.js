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
  receiverData: {
    displayName: "",
    photoURL: "",
    uid: "",
    connectionId: "",
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

      state.user = action.payload;
      state.receiverData = initialState.receiverData;
    },
    logOut: (state, action) => {
      state.isLoggedIn = false;
      state.user = initialState.user;
      state.receiverData = initialState.receiverData;
    },
    setReceiverId: (state, action) => {
      state.receiverData = action.payload;
    },
  },
});

// export reducer
export default UserSlice.reducer;

export const { loggedIn, logOut, setReceiverId } = UserSlice.actions;
