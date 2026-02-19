// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer    from './slices/authSlice.js';
import companyReducer from './slices/companySlice.js';
import programReducer from './slices/programSlice.js';

const store = configureStore({
  reducer: {
    auth:    authReducer,
    company: companyReducer,
    program: programReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;