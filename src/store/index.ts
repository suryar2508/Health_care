import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientReducer from './slices/patientSlice';
import doctorReducer from './slices/doctorSlice';
import appointmentReducer from './slices/appointmentSlice';
import prescriptionReducer from './slices/prescriptionSlice';
import medicalRecordReducer from './slices/medicalRecordSlice';
import billingReducer from './slices/billingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    doctors: doctorReducer,
    appointments: appointmentReducer,
    prescriptions: prescriptionReducer,
    medicalRecords: medicalRecordReducer,
    billing: billingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 