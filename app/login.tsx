import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../src/stores/userStore';
import { sendVerifyCode, login } from '../src/api/page-apis/login-api';
import { Header } from '../src/components/public-components';

export default function LoginScreen() {
  const router = useRouter();
  const { login: loginStore } = useUserStore();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }

    setLoading(true);
    try {
      await sendVerifyCode(phone);
      setStep('code');
    } catch (error) {
      Alert.alert('错误', '发送验证码失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      Alert.alert('提示', '请输入6位验证码');
      return;
    }

    setLoading(true);
    try {
      const response = await login(phone, verifyCode);
      loginStore(phone, response.token);
      router.replace('/submit');
    } catch (error) {
      Alert.alert('错误', '登录失败，请检查验证码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container} testID="login-screen">
      <Header title="手机号登录" />
      
      <View style={styles.content}>
        <Text style={styles.title} testID="login-title">
          {step === 'phone' ? '输入手机号' : '输入验证码'}
        </Text>

        {step === 'phone' ? (
          <>
            <View style={styles.inputContainer} testID="phone-input-container">
              <TextInput
                style={styles.input}
                placeholder="请输入手机号"
                placeholderTextColor="#737373"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={11}
                testID="phone-input"
              />
            </View>
            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendCode}
              disabled={loading}
              testID="send-code-button"
            >
              <Text style={styles.buttonText}>
                {loading ? '发送中...' : '发送验证码'}
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.hint} testID="code-hint">
              验证码已发送至 {phone}
            </Text>
            <View style={styles.inputContainer} testID="code-input-container">
              <TextInput
                style={styles.input}
                placeholder="请输入验证码"
                placeholderTextColor="#737373"
                value={verifyCode}
                onChangeText={setVerifyCode}
                keyboardType="number-pad"
                maxLength={6}
                testID="code-input"
              />
            </View>
            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              testID="login-button"
            >
              <Text style={styles.buttonText}>
                {loading ? '登录中...' : '登录'}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  hint: {
    color: '#a3a3a3',
    fontSize: 14,
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: '#000000',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#262626',
    marginBottom: 24,
    minHeight: 56,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#ff5111',
    borderRadius: 8,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
