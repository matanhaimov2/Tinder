import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default is localStorage
import authReducer from './features/authSlice';

// Configure persist reducer
const persistConfig = {
  key: 'root',
  storage,
};

// Wrap the authReducer with persistReducer to enable persistence
const persistedReducer = persistReducer(persistConfig, authReducer);

// Create the Redux store with the persisted reducer
const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
});

// Create a persistor to handle the rehydration process
export const persistor = persistStore(store);

// Export types for use in components and hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
