import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { radius, spacing, fontSizes } from '@/constants/theme';
import { Icon, IconName } from './Icon';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  style,
  fullWidth,
}) => {
  const { theme } = useTheme();

  const bgColor = {
    primary: theme.primary,
    secondary: theme.secondary,
    outline: 'transparent',
    danger: theme.danger,
    ghost: 'transparent',
  }[variant];

  const textColor = variant === 'outline' || variant === 'ghost' ? theme.primary : '#0F0B1E';
  const finalTextColor = variant === 'primary' || variant === 'danger' ? '#FFFFFF' : textColor;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bgColor,
          borderColor: variant === 'outline' ? theme.primary : 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={finalTextColor} size="small" />
      ) : (
        <>
          {icon && <Icon name={icon} size={18} color={finalTextColor} />}
          <Text style={[styles.label, { color: finalTextColor }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
});

export default Button;
