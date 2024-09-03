import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AddressState {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
}

const initialState: AddressState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  zip: '',
}

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<AddressState>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { setAddress } = addressSlice.actions
export default addressSlice.reducer