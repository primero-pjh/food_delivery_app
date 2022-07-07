import {useEffect} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

// url: scheme app별로 스킴이 다름
// Linking.openURL('http://') 도 가능하다.
// Linking.openURL('tel://010123456789') 하면 이 전화번호로 다이얼
// Linking.openURL('sms://010123456789') 하면 이 전화번호로 다이얼
// Linking.openURL('upbitex://account') 하면 특정 페이지로 넘어감

function usePermissions() {
  // 권한 관련
  useEffect(() => {
    // 안드로이드일 때
    if (Platform.OS === 'android') {
      // 위치 권한을 얻어온다(정교한 위치 권한)
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
          console.log('check location', result);
          if(result === RESULTS.DENIED) {
            // request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
          } else if (result === RESULTS.BLOCKED) {
            Alert.alert(
              '이 앱은 위치 권한 허용이 필요합니다.',// title
              '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',// message
              // buttons
              [
                {
                  text: '네',
                  onPress: () => Linking.openSettings(),
                  style: 'default',
                },
                {
                  text: '아니오',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            );
          }
        })
        .catch(console.error);
    // ios일때
    } else if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS)
        .then(result => {
          if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
            Alert.alert(
              '이 앱은 백그라운드 위치 권한 허용이 필요합니다.',
              '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',
              [
                {
                  text: '네',
                  onPress: () => Linking.openSettings(),
                },
                {
                  text: '아니오',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            );
          }
        })
        .catch(console.error);
    }
    if (Platform.OS === 'android') {
      // 카메라 권한
      check(PERMISSIONS.ANDROID.CAMERA)
        .then(result => {
          // GRANTED 면 이미 카메라 권한이 있기 때문에 없어도 된다.
          // GRANTED 가 아니면 허용되는 상황에서 에러문이 뜬다.
          if (result === RESULTS.DENIED || result === RESULTS.GRANTED) {
            return request(PERMISSIONS.ANDROID.CAMERA);
          } else {
            console.log(result);
            throw new Error('카메라 지원 안 함');
          }
        })
        .catch(console.error);
    } else if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.CAMERA)
        .then(result => {
          if (
            result === RESULTS.DENIED ||
            result === RESULTS.LIMITED ||
            result === RESULTS.GRANTED
          ) {
            return request(PERMISSIONS.IOS.CAMERA);
          } else {
            console.log(result);
            throw new Error('카메라 지원 안 함');
          }
        })
        .catch(console.error);
    }
  }, []);
}

export default usePermissions;