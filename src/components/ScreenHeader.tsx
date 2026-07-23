import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { fontSizes, spacing } from '@/constants/theme';
import { Icon, IconName } from './Icon';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightIcon?: IconName;
  onRightPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, rightIcon, onRightPress }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
      </View>
      {rightIcon && (
        <Pressable
          onPress={onRightPress}
          style={[styles.iconBtn, { backgroundColor: theme.cardAlt, borderColor: theme.border }]}
        >
          <Icon name={rightIcon} size={20} color={theme.textPrimary} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: fontSizes.sm,
    marginTop: 2,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ScreenHeader;
