// src/components/common/LoadingOverlay.tsx
import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Text,
} from 'react-native';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Түр хүлээнэ үү...',
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: colors.white,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
  },
  message: {
    marginTop: 15,
    fontSize: fontSizes.md,
    color: colors.text,
    textAlign: 'center',
  },
});

export default LoadingOverlay;