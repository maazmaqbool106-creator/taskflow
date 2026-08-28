import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "../../hooks/useAppTheme";
import { validatePassword } from "../../utils/validation";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "ChangePassword">;

export default function ChangePasswordScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [currentFocused, setCurrentFocused] = useState(false);
  const [newFocused, setNewFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      Alert.alert("Weak Password", validation.message);
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert("Error", "New password cannot be the same as the current password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    setLoading(true);
    // Simulate API request delay
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Success",
        "Your password has been changed successfully.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <View style={styles.backButtonContainer}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backArrow,
            { backgroundColor: colors.card, borderColor: colors.border },
            pressed && { opacity: 0.8 },
          ]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Feather name="arrow-left" size={20} color={colors.text} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.innerContainer}>
            <View style={styles.header}>
              <View style={[styles.icon, { backgroundColor: colors.primaryLight }]}>
                <Feather name="key" size={28} color={colors.primary} />
              </View>

              <Text style={[styles.title, { color: colors.text }]}>Change Password</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Update your account password.
              </Text>
            </View>

            <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {/* Current Password Field */}
              <Text style={[styles.label, { color: colors.textSecondary }]}>Current Password</Text>
              <View
                style={[
                  styles.passwordContainer,
                  {
                    backgroundColor: colors.card,
                    borderColor: currentFocused ? colors.primary : colors.border,
                  },
                ]}
              >
                <TextInput
                  style={[styles.passwordInput, { color: colors.text }]}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  editable={!loading}
                  onFocus={() => setCurrentFocused(true)}
                  onBlur={() => setCurrentFocused(false)}
                />
                <Pressable
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={loading}
                  style={styles.eyeIcon}
                  accessibilityLabel={showCurrentPassword ? "Hide password" : "Show password"}
                  accessibilityRole="button"
                >
                  <Feather
                    name={showCurrentPassword ? "eye" : "eye-off"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>

              {/* New Password Field */}
              <Text style={[styles.label, { color: colors.textSecondary }]}>New Password</Text>
              <View
                style={[
                  styles.passwordContainer,
                  {
                    backgroundColor: colors.card,
                    borderColor: newFocused ? colors.primary : colors.border,
                  },
                ]}
              >
                <TextInput
                  style={[styles.passwordInput, { color: colors.text }]}
                  placeholder="Create new password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  editable={!loading}
                  onFocus={() => setNewFocused(true)}
                  onBlur={() => setNewFocused(false)}
                />
                <Pressable
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  disabled={loading}
                  style={styles.eyeIcon}
                  accessibilityLabel={showNewPassword ? "Hide password" : "Show password"}
                  accessibilityRole="button"
                >
                  <Feather
                    name={showNewPassword ? "eye" : "eye-off"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>

              {newPassword.length > 0 && !validatePassword(newPassword).isValid && (
                <Text style={[styles.errorText, { color: colors.danger }]}>
                  {validatePassword(newPassword).message}
                </Text>
              )}

              {/* Confirm New Password Field */}
              <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm New Password</Text>
              <View
                style={[
                  styles.passwordContainer,
                  {
                    backgroundColor: colors.card,
                    borderColor: confirmFocused ? colors.primary : colors.border,
                  },
                ]}
              >
                <TextInput
                  style={[styles.passwordInput, { color: colors.text }]}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!loading}
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  style={styles.eyeIcon}
                  accessibilityLabel={showConfirmPassword ? "Hide password" : "Show password"}
                  accessibilityRole="button"
                >
                  <Feather
                    name={showConfirmPassword ? "eye" : "eye-off"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: colors.primary },
                  loading && styles.disabledButton,
                  pressed && !loading && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                ]}
                onPress={handleChangePassword}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Updating..." : "Change Password"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  innerContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  backButtonContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 4,
  },
  backArrow: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 7,
    fontSize: 14,
    textAlign: "center",
    maxWidth: 300,
  },
  form: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  passwordContainer: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 14,
    marginBottom: 18,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
  },
  eyeIcon: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 12,
    marginTop: -12,
    marginBottom: 14,
    fontWeight: "600",
  },
  button: {
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
