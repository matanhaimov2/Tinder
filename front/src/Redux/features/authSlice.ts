import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string;
  userData: any[]; // Adjust the type based on your data structure
  isLoggedIn: boolean;
  csrfToken: string | null;
}

const initialState: AuthState = {
  accessToken: '',
  userData: [],
  isLoggedIn: true,
  csrfToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setUserData(state, action: PayloadAction<any[]>) { // Adjust type
      state.userData = action.payload;
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    setCsrfToken(state, action: PayloadAction<string | null>) {
      state.csrfToken = action.payload;
    },
  },
});

export const { setAccessToken, setUserData, setIsLoggedIn, setCsrfToken } = authSlice.actions;
export default authSlice.reducer;
