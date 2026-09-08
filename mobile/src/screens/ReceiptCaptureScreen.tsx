import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { receiptApi } from '../services/api';
import { Camera, Image as ImageIcon, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react-native';

export const ReceiptCaptureScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Required', 'Camera permission is needed to scan physical receipts.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setSelectedFile({
        uri: asset.uri,
        name: asset.fileName || 'receipt.jpg',
        type: 'image/jpeg',
      });
      setOcrResult(null);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setSelectedFile({
        uri: asset.uri,
        name: asset.fileName || 'receipt.jpg',
        type: 'image/jpeg',
      });
      setOcrResult(null);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const doc = result.assets[0];
      setSelectedFile({
        uri: doc.uri,
        name: doc.name,
        type: doc.mimeType || 'application/pdf',
      });
      setOcrResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.type,
      } as any);
      formData.append('source', 'MOBILE');

      const res = await receiptApi.uploadReceipt(formData);
      if (res.data.success) {
        setOcrResult(res.data.data);
      } else {
        Alert.alert('Upload Failed', res.data.message || 'Unable to upload receipt.');
      }
    } catch (e: any) {
      Alert.alert('Upload Error', e.response?.data?.message || 'Error processing receipt.');
    }
    setUploading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Scan & Upload Receipt</Text>
      <Text style={styles.subtitle}>Capture physical bills or select images/PDFs from device.</Text>

      {/* Capture Action Options */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionCard} onPress={takePhoto}>
          <Camera size={24} color="#2563EB" />
          <Text style={styles.actionLabel}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={pickImage}>
          <ImageIcon size={24} color="#059669" />
          <Text style={styles.actionLabel}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={pickDocument}>
          <FileText size={24} color="#7C3AED" />
          <Text style={styles.actionLabel}>PDF / File</Text>
        </TouchableOpacity>
      </View>

      {/* Preview Area */}
      {selectedFile ? (
        <View style={styles.previewCard}>
          <Text style={styles.previewHeader}>Selected File:</Text>
          <Text style={styles.fileName}>{selectedFile.name}</Text>

          {selectedFile.type.startsWith('image') ? (
            <Image source={{ uri: selectedFile.uri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.pdfBox}>
              <FileText size={32} color="#475569" />
              <Text style={styles.pdfText}>PDF Document</Text>
            </View>
          )}

          {!ocrResult ? (
            <TouchableOpacity
              style={[styles.uploadButton, uploading && styles.disabledButton]}
              onPress={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.uploadButtonText}>Upload & Process OCR</Text>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {/* OCR Result & Review Navigation */}
      {ocrResult ? (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <CheckCircle2 size={20} color="#059669" />
            <Text style={styles.resultTitle}>OCR Processing Complete!</Text>
          </View>

          <View style={styles.extractedBox}>
            <Text style={styles.extractedLabel}>Extracted Vendor:</Text>
            <Text style={styles.extractedValue}>{ocrResult.vendorName || 'Not Detected'}</Text>

            <Text style={styles.extractedLabel}>Total Amount:</Text>
            <Text style={styles.extractedAmount}>₹{ocrResult.totalAmount || 0}</Text>

            <Text style={styles.extractedLabel}>OCR Status:</Text>
            <Text style={[styles.statusBadge, ocrResult.ocrStatus === 'COMPLETED' ? styles.statusSuccess : styles.statusWarning]}>
              {ocrResult.ocrStatus}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() => navigation.navigate('ReceiptDetails', { receiptId: ocrResult.id })}
          >
            <Text style={styles.reviewButtonText}>Review & Save Receipt</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  subtitle: { fontSize: 12, color: '#64748B', marginTop: 4, marginBottom: 16 },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  actionCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', gap: 8 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: '#1E293B', marginTop: 4 },
  previewCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  previewHeader: { fontSize: 12, color: '#64748B' },
  fileName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 2, marginBottom: 12 },
  imagePreview: { width: '100%', height: 200, borderRadius: 8, resizeMode: 'cover', marginBottom: 14 },
  pdfBox: { width: '100%', height: 120, borderRadius: 8, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  pdfText: { fontSize: 12, color: '#475569', marginTop: 6 },
  uploadButton: { backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  disabledButton: { opacity: 0.6 },
  uploadButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  resultCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#10B981' },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  resultTitle: { fontSize: 15, fontWeight: '700', color: '#065F46', marginLeft: 6 },
  extractedBox: { backgroundColor: '#F0FDF4', padding: 12, borderRadius: 10, marginBottom: 14 },
  extractedLabel: { fontSize: 10, color: '#047857', marginTop: 4 },
  extractedValue: { fontSize: 14, fontWeight: '700', color: '#064E3B' },
  extractedAmount: { fontSize: 18, fontWeight: '800', color: '#064E3B' },
  statusBadge: { fontSize: 10, fontWeight: '700', marginTop: 4, alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusSuccess: { backgroundColor: '#D1FAE5', color: '#047857' },
  statusWarning: { backgroundColor: '#FEF3C7', color: '#B45309' },
  reviewButton: { backgroundColor: '#059669', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, gap: 8 },
  reviewButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginRight: 6 }
});
