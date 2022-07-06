import React, { useCallback }  from 'react';
import {FlatList, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import { useSelector } from 'react-redux';
import EacaOrder from '../components/EachOrder';
import { Order } from '../slices/order';
import { RootState } from '../store/reducer';

function Orders() {
    const orders = useSelector((state: RootState) => state.order.orders);
    const renderItem = useCallback(({item} : {item: Order}) => {
      // 반복 대상이 되는건 무조건 component로 분리해라.
      return <EacaOrder item={item}></EacaOrder>;
    }, []);
    return (
      <FlatList data={orders} keyExtractor={item => item.orderId}
        renderItem={renderItem}  
      />
    );
}

export default Orders;