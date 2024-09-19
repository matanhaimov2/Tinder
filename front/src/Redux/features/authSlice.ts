import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserData, UpdatedUserData } from './types'; // Adjust the import path as needed

const initialState: AuthState = {
  accessToken: '',
  userData: null,
  updatedUserData: null,
  isLoggedIn: false,
  csrfToken: '',
  didMatchOccuer: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setUserData(state, action: PayloadAction<UserData | null>) { // accepts UserData or null
      state.userData = action.payload;
    },
    setUpdatedUserData(state, action: PayloadAction<UpdatedUserData | null>) {
      state.updatedUserData = action.payload;
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    setCsrfToken(state, action: PayloadAction<string>) {
      state.csrfToken = action.payload;
    },
    setDidMatchOccuer(state, action: PayloadAction<boolean>) {
      state.didMatchOccuer = action.payload;
    }
  },
});

export const { setAccessToken, setUserData, setUpdatedUserData, setIsLoggedIn, setCsrfToken, setDidMatchOccuer } = authSlice.actions;
export default authSlice.reducer;
