import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiService } from '../../services/api';

export interface Prescription {
  _id: string;
  patientId: string;
  doctorId: string;
  date: string;
  medications: Medication[];
  instructions: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  totalAmount?: number;
  pharmacyId?: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  price: number;
}

interface PrescriptionState {
  prescriptions: Prescription[];
  selectedPrescription: Prescription | null;
  loading: boolean;
  error: string | null;
}

const initialState: PrescriptionState = {
  prescriptions: [],
  selectedPrescription: null,
  loading: false,
  error: null,
};

export const fetchPrescriptions = createAsyncThunk(
  'prescriptions/fetchPrescriptions',
  async () => {
    const response = await ApiService.getPrescriptions();
    return response.data;
  }
);

export const createPrescription = createAsyncThunk(
  'prescriptions/createPrescription',
  async (prescriptionData: Omit<Prescription, '_id'>) => {
    const response = await ApiService.createPrescription(prescriptionData);
    return response.data;
  }
);

export const updatePrescriptionStatus = createAsyncThunk(
  'prescriptions/updatePrescriptionStatus',
  async ({ id, status }: { id: string; status: Prescription['status'] }) => {
    const response = await ApiService.updatePrescriptionStatus(id, status);
    return response.data;
  }
);

const prescriptionSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    setSelectedPrescription: (state, action) => {
      state.selectedPrescription = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch prescriptions';
      })
      .addCase(createPrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions.push(action.payload);
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create prescription';
      })
      .addCase(updatePrescriptionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrescriptionStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.prescriptions.findIndex(
          (prescription) => prescription._id === action.payload._id
        );
        if (index !== -1) {
          state.prescriptions[index] = action.payload;
        }
      })
      .addCase(updatePrescriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update prescription status';
      });
  },
});

export const { setSelectedPrescription } = prescriptionSlice.actions;
export default prescriptionSlice.reducer; 