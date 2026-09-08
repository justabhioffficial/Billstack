import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../services/api';
import { Receipt, Mail, KeyRound, ArrowRight } from 'lucide-react-native';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [mode, setMode] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handlePasswordLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (e: any) {
      Alert.alert('Login Error', e.response?.data?.message || 'Invalid credentials.');
    }
    setLoading(false);
  };

  const handleRequestOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      await authApi.requestLoginOtp({ email });
      setOtpSent(true);
      Alert.alert('OTP Sent', 'A 6-digit OTP code has been dispatched to your email.');
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Unable to send login OTP.');
    }
    setLoading(false);
  };

  const handleOtpLogin = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.loginWithOtp({ email, otp });
      if (res.data.success) {
        // Logged in
      }
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Invalid or expired OTP code.');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Receipt size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>BillStack</Text>
        <Text style={styles.subtitle}>Sign in to access your expenses</Text>
      </View>

      {/* Mode Switch Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, mode === 'password' && styles.activeTab]}
          onPress={() => setMode('password')}
        >
          <Text style={[styles.tabText, mode === 'password' && styles.activeTabText]}>Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mode === 'otp' && styles.activeTab]}
          onPress={() => setMode('otp')}
        >
          <Text style={[styles.tabText, mode === 'otp' && styles.activeTabText]}>Login with OTP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {mode === 'password' ? (
          <>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handlePasswordLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitBtnText}>Sign In</Text>}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {otpSent && (
              <>
                <Text style={styles.label}>6-Digit OTP Code</Text>
                <TextInput
                  style={[styles.input, styles.otpInput]}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="123456"
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </>
            )}

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={!otpSent ? handleRequestOtp : handleOtpLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>{!otpSent ? 'Send Login OTP' : 'Verify & Sign In'}</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.footerLink} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.footerText}>Don't have an account? <Text style={styles.boldText}>Create Free Account</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 24, justifyContent: 'center', minHeight: '100%' },
  header: { alignItems: 'center', marginBottom: 24 },
  logoBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 10, padding: 3, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#FFFFFF' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  activeTabText: { color: '#2563EB', fontWeight: '700' },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  label: { fontSize: 11, fontWeight: '700', color: '#64748B', marginTop: 12, marginBottom: 4, textTransform: 'uppercase' },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#0F172A' },
  otpInput: { textAlign: 'center', fontSize: 18, fontWeight: '800', letterSpacing: 4 },
  submitBtn: { backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  submitBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  footerLink: { marginTop: 20, alignItems: 'center' },
  footerText: { fontSize: 13, color: '#64748B' },
  boldText: { fontWeight: '700', color: '#2563EB' }
});
