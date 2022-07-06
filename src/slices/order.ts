import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface란 객체에 대한 타이핑
export interface Order {
  orderId: string;
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
  price: number;
}

interface InitialState {
  orders: Order[],
  deliveries: Order[],
}
const initialState: InitialState = {
  // 빈 배열이면 type 에러가 난다.
  orders: [],
  deliveries: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      // interface를 사용하지 않으면 action.payload에서 typescript 에러가 난다.
      // any 라는 타입이 뜨면 타입스크립트가 타입을 추론을 못하는 거
      state.orders.push(action.payload);
    },
    acceptOrder(state, action: PayloadAction<string>) {
      const index = state.orders.findIndex((x) => x.orderId === action.payload);
      if(index > -1) {
        state.deliveries.push(state.orders[index]);
        state.orders.splice(index, 1);
      }
    },
    rejectOrder(state, action) {
      var index = state.orders.findIndex((x) => x.orderId === action.payload);
      if(index > -1) {
        state.orders.splice(index, 1);
      }

      index = state.deliveries.findIndex((x) => x.orderId === action.payload);
      if(index > -1) {
        state.deliveries.splice(index, 1);
      }
    },
  },
  extraReducers: builder => {},
});

export default orderSlice;