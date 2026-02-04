// src/components/common/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    };

    // Size
    if (size === 'small') {
      baseStyle.paddingVertical = 10;
      baseStyle.paddingHorizontal = 20;
    } else if (size === 'large') {
      baseStyle.paddingVertical = 18;
      baseStyle.paddingHorizontal = 30;
    } else {
      baseStyle.paddingVertical = 14;
      baseStyle.paddingHorizontal = 25;
    }

    // Variant
    if (variant === 'primary') {
      baseStyle.backgroundColor = colors.primary;
    } else if (variant === 'secondary') {
      baseStyle.backgroundColor = colors.success;
    } else if (variant === 'outline') {
      baseStyle.backgroundColor = 'transparent';
      baseStyle.borderWidth = 2;
      baseStyle.borderColor = colors.primary;
    } else if (variant === 'danger') {
      baseStyle.backgroundColor = colors.error;
    }

    // Disabled
    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: 'bold',
    };

    // Size
    if (size === 'small') {
      baseTextStyle.fontSize = fontSizes.sm;
    } else if (size === 'large') {
      baseTextStyle.fontSize = fontSizes.lg;
    } else {
      baseTextStyle.fontSize = fontSizes.md;
    }

    // Variant
    if (variant === 'outline') {
      baseTextStyle.color = colors.primary;
    } else {
      baseTextStyle.color = colors.white;
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;