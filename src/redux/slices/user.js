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
  selectedGroup: {
    id: "",
    groupName: "",
    members: "",
    admin: "",
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
      state.selectedGroup = initialState.selectedGroup;
    },
    setReceiverId: (state, action) => {
      state.selectedGroup = initialState.selectedGroup;
      state.receiverData = action.payload;
    },
    setGroup: (state, action) => {
      state.receiverData = initialState.receiverData;
      state.selectedGroup = action.payload;
    },
  },
});

// export reducer
export default UserSlice.reducer;

export const { loggedIn, logOut, setReceiverId, setGroup } = UserSlice.actions;
