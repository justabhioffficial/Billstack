import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { askApi } from '../services/api';
import { Sparkles, Send } from 'lucide-react-native';

export const AskBillStackScreen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Hi! Ask me anything about your expenses. Example: "How much did I spend this month?" or "Show my biggest expenses."' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMsg = prompt.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await askApi.query({ prompt: userMsg });
      if (res.data.success) {
        setMessages((prev) => [...prev, { sender: 'bot', text: res.data.data.answer }]);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, I had trouble analyzing your query. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Sparkles size={20} color="#7C3AED" />
        <Text style={styles.headerTitle}>Ask BillStack Financial Copilot</Text>
      </View>

      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        {messages.map((m, i) => (
          <View key={i} style={[styles.bubble, m.sender === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={m.sender === 'user' ? styles.userText : styles.botText}>{m.text}</Text>
          </View>
        ))}
        {loading ? <ActivityIndicator size="small" color="#7C3AED" style={styles.loader} /> : null}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask a question about your expenses..."
          value={prompt}
          onChangeText={setPrompt}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={loading}>
          <Send size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginLeft: 6 },
  chatArea: { flex: 1 },
  chatContent: { padding: 16, gap: 12 },
  bubble: { padding: 12, borderRadius: 12, maxWidth: '85%' },
  userBubble: { backgroundColor: '#2563EB', alignSelf: 'flex-end' },
  botBubble: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#E2E8F0' },
  userText: { color: '#FFFFFF', fontSize: 13 },
  botText: { color: '#0F172A', fontSize: 13, lineHeight: 18 },
  loader: { alignSelf: 'flex-start', marginVertical: 8 },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0', gap: 8 },
  input: { flex: 1, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 12, fontSize: 13, color: '#0F172A' },
  sendBtn: { backgroundColor: '#7C3AED', width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }
});
