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

type Props = NativeStackScreenProps<RootStackParamList, "ResetPassword">;

export default function ResetPasswordScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  
  const emailParam = route.params?.email || "";
  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [emailFocused, setEmailFocused] = useState(false);
  const [codeFocused, setCodeFocused] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const handleReset = () => {
    if (!email.trim() || !code.trim() || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      Alert.alert("Weak Password", validation.message);
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
        "Password Reset Success",
        "Your password has been successfully reset. Please log in with your new password.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
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
                <Feather name="lock" size={28} color={colors.primary} />
              </View>

              <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Enter your reset details below to set a new password.
              </Text>
            </View>

            <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {/* Email Field */}
              <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: emailFocused ? colors.primary : colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />

              {/* Code Field */}
              <Text style={[styles.label, { color: colors.textSecondary }]}>Verification Code</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: codeFocused ? colors.primary : colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Enter 6-digit code"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={code}
                onChangeText={setCode}
                editable={!loading}
                onFocus={() => setCodeFocused(true)}
                onBlur={() => setCodeFocused(false)}
              />

              {/* New Password Field */}
              <Text style={[styles.label, { color: colors.textSecondary }]}>New Password</Text>
              <View
                style={[
                  styles.passwordContainer,
                  {
                    backgroundColor: colors.card,
                    borderColor: newPasswordFocused ? colors.primary : colors.border,
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
                  onFocus={() => setNewPasswordFocused(true)}
                  onBlur={() => setNewPasswordFocused(false)}
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
                    borderColor: confirmPasswordFocused ? colors.primary : colors.border,
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
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
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
                onPress={handleReset}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Resetting..." : "Reset Password"}
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
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 18,
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
