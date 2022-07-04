import {createSlice} from '@reduxjs/toolkit';

// store -> root reducer( state) -> user slice, order slice,,,


// action: state를 바꾸는 동작, 행위
// dispatch: 그 액션을 실제로 실행하는 함수
// reducer: 액션이 실제로 실행되면 state를 바꾸는 로직

const initialState = {
  name: '',
  email: '',
  accessToken: '',
  refreshToken: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  // 동기 action
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
      // state.refreshToken = action.payload.refreshToken;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setEmail(state, action) {
      state.name = action.payload;
    },
  },
  // 비동기 action
  extraReducers: builder => {},
});

export default userSlice;
