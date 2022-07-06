import { NavigationProp, useNavigation } from "@react-navigation/native";
import axios, { AxiosError } from "axios";
import React, { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Config from "react-native-config";
import { useSelector } from "react-redux";
import { LoggedInParamList } from "../../AppInner";
import orderSlice, { Order } from "../slices/order";
import { useAppDispatch } from "../store";
import { RootState } from "../store/reducer";


function EacaOrder({item}: {item:Order}) {
  const dispatch = useAppDispatch();
  // props 드릴링을 안하기 위해 hook을 사용
  // 단점: 타입 추론이 잘 되지 않음
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const [detail, setDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const toggleDetail = useCallback(() => {
    setDetail(prev => !prev);
  }, []);
  const onAccept = useCallback( async () => {
    try {
      setLoading(false);
      await axios.post(`${Config.API_URL}/accept`, { 
        orderId: item.orderId 
      }, { 
        headers: {authorization: `Bearer ${accessToken}` }
      });
      dispatch(orderSlice.actions.acceptOrder(item.orderId));
      setLoading(true);
      navigation.navigate("Delivery");
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      // 성공: 200
      // 실패: 400, 500, 401, 404
      if(errorResponse?.status === 400) {
        Alert.alert("알림", errorResponse.data.mesasge);
        dispatch(orderSlice.actions.rejectOrder(item.orderId));
      }
      setLoading(true);
    } finally {
      // page 가 route 되는 경우 finally를 사용하지 않는다.
    }
  }, [accessToken, navigation, dispatch, item.orderId]);

  const onReject = useCallback(() => {
    dispatch(orderSlice.actions.rejectOrder(item.orderId));
  }, [dispatch, item.orderId]);
  return (
    <View key={item.orderId} style={styles.orderContainer}>
      <Pressable onPress={toggleDetail} style={styles.info}>
        <Text style={styles.eachInfo}>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
        </Text>
        <Text>
          삼성동
        </Text>
        <Text>
          왕십리동
        </Text>
      </Pressable> 
      {detail ? ( 
        <View>
          <View>
            <Text>네이버맵이 들어갈 장소</Text>
          </View> 
          <View style={styles.buttonWrapper}>
            <Pressable onPress={onAccept} disabled={loading} style={styles.acceptButton}>
              <Text style={styles.buttonText}>수락</Text>
            </Pressable>
            <Pressable onPress={onReject} disabled={loading} style={styles.rejectButton}>
              <Text style={styles.buttonText}>거절</Text>
            </Pressable>
          </View>
        </View> 
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  orderContainer: {
    borderRadius: 5,
    margin: 5,
    padding: 10,
    backgroundColor: 'lightgray',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eachInfo: {
    // flex: 1,
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  acceptButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    flex: 1,
  },
  rejectButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    flex: 1,
  },

});

export default EacaOrder;