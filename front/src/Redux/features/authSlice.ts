import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserData } from './types'; // Adjust the import path as needed

const initialState: AuthState = {
  accessToken: '',
  userData: null,
  isLoggedIn: false,
  csrfToken: '',
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
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    setCsrfToken(state, action: PayloadAction<string>) {
      state.csrfToken = action.payload;
    },
  },
});

export const { setAccessToken, setUserData, setIsLoggedIn, setCsrfToken } = authSlice.actions;
export default authSlice.reducer;
