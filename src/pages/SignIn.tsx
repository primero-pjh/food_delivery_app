import React, { useState, useCallback, useRef } from 'react';
import { 
  Alert, 
  Pressable, 
  Text, 
  View, 
  TextInput, 
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps} from "@react-navigation/native-stack";
import DismissKeyboardView from '../components/DismissKeyboardView';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import userSlice from '../slices/user';
import { RootStackParamList } from '../../AppInner';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, "SignIn">;

function SignIn({navigation} : SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null); // generic
  const passwordRef = useRef<TextInput | null>(null);
  const [loading, setLoading] = useState(false);

  const onChangeEmail = useCallback(text => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);

  const onSubmit = useCallback(async () => {
    if(!email || !email.trim()) {
      return Alert.alert("알림", "이메일을 입력해주세요.");
    }
    if(!password || !password.trim()) {
      return Alert.alert("알림", "비밀번호를 입력해주세요.");
    }
    try {
      setLoading(true);
      const response = await axios.post(`${Config.API_URL}/login`, {
        email,
        password
      });
      console.log(response.data);
      Alert.alert("알림", "로그인 되었습니다.");
      // redux
      dispatch(
        userSlice.actions.setUser({
          name: response.data.name,
          email: response.data.email,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      )

    } catch (error) {
      console.error("error:", error);
      console.log("Catch");
      // error 는 unknown 이라서 타입을 지정해줘야함
      var errorResponse = (error as AxiosError).response;
      // Alert.alert("알림", errorResponse.data.message);
      if(errorResponse) {
        
      }
    } finally {
      setLoading(false);
    }
  }, [email, password]);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  // 최대한 변수명으로 깔끔하게 만들어라
  const canGoNext = email && password;   // email과 password가 null이 아니라면 진행
  return (
    <DismissKeyboardView>
      <View  style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput style={styles.textInput} 
          placeholder="이메일을 입력해주세요." 
          value={email}
          ref={emailRef}
          onChangeText={onChangeEmail} 
          importantForAutofill="yes"
          autoComplete="email"
          textContentType="emailAddress"
          keyboardType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordRef.current?.focus();  // password 로 focus 이동
          }}
          blurOnSubmit={ false } // 키보드 내려가는 것을 막는 것
          clearButtonMode="while-editing"
        />
      </View>
      <View  style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput style={styles.textInput} 
          placeholder="비밀번호를 입력해주세요." 
          value={password}
          ref={passwordRef}
          onChangeText={onChangePassword}
          secureTextEntry
          importantForAutofill="yes"
          autoComplete="password"
          keyboardType="decimal"
          textContentType="password"
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable onPress={onSubmit} 
          // style={ !canGoNext ? styles.loginButton : [
          //   styles.loginButton, styles.loginButtonActive
          // ]} 
          style={ !canGoNext ? styles.loginButton : 
            StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
          } 
          disabled={ !canGoNext }>
          <Text style={styles.loginButtonText}>로그인</Text>
        </Pressable>
        <Pressable onPress={toSignUp}>
          <Text >회원가입하기</Text>
        </Pressable>
      </View>

    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    padding: 20,
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal:20,
    paddingVertical: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonZone: {
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

})

export default SignIn;