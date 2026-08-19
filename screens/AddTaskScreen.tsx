import React, { useEffect, useState } from "react";
import {
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
import * as Haptics from "expo-haptics";
import { useTasks } from "../hooks/useTasks";
import { useAppTheme } from "../hooks/useAppTheme";
import DatePickerModal from "../components/DatePickerModal";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "AddTask">;

export default function AddTaskScreen({ route, navigation }: Props) {
  const editTaskId = route.params?.editTaskId;
  const isEditMode = !!editTaskId;

  const { tasks, addTask, updateTask, toggleTaskCompletion } = useTasks();
  const { colors, isDark } = useAppTheme();

  // Find task if in edit mode
  const taskToEdit = isEditMode ? tasks.find((t) => t.id === editTaskId) : null;

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);

  // Validation state
  const [titleTouched, setTitleTouched] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Load task values if in edit mode
  useEffect(() => {
    if (isEditMode && taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate);
      setCompleted(taskToEdit.completed);
    }
  }, [isEditMode, taskToEdit]);

  const isTitleInvalid = titleTouched && !title.trim();

  const handleSave = async () => {
    setTitleTouched(true);
    
    if (!title.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate: dueDate || new Date().toISOString().split("T")[0], // Default to today's date if empty
    };

    if (isEditMode && taskToEdit) {
      await updateTask(taskToEdit.id, taskData);
      
      // Update completion state separately if it changed
      if (completed !== taskToEdit.completed) {
        await toggleTaskCompletion(taskToEdit.id);
      }
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } else {
      await addTask({
        ...taskData,
        completed: false,
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    }
  };

  const getFormattedDate = () => {
    if (!dueDate) return "Select date";
    const d = new Date(dueDate);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isSaveDisabled = !title.trim();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            {isEditMode ? "Modify Task" : "Create New Task"}
          </Text>

          {/* Title Input */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Task Title *</Text>
          <TextInput
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (!titleTouched) setTitleTouched(true);
            }}
            onBlur={() => setTitleTouched(true)}
            placeholder="e.g. Complete React Native project"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: isTitleInvalid ? colors.danger : colors.border,
                color: colors.text,
              },
            ]}
          />
          {isTitleInvalid && (
            <Text style={[styles.errorText, { color: colors.danger }]}>
              Task title is required.
            </Text>
          )}

          {/* Description Input */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add details about this task..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[
              styles.input,
              styles.descriptionInput,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
          />

          {/* Due Date Picker Button */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Due Date</Text>
          <Pressable
            onPress={() => setDatePickerVisible(true)}
            style={[
              styles.datePickerBtn,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.datePickerContent}>
              <Feather name="calendar" size={18} color={colors.textSecondary} style={styles.fieldIcon} />
              <Text
                style={[
                  styles.dateText,
                  { color: dueDate ? colors.text : colors.textMuted },
                ]}
              >
                {getFormattedSelected(dueDate)}
              </Text>
            </View>
            <Feather name="chevron-down" size={16} color={colors.textSecondary} />
          </Pressable>

          {/* Category Chooser */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
          <View style={styles.optionsRow}>
            {["Work", "Study", "Personal", "Other"].map((item) => {
              const isSelected = category === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setCategory(item)}
                  style={[
                    styles.option,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: isSelected ? "#FFFFFF" : colors.textSecondary },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Priority Chooser */}
          <Text style={[styles.label, { color: colors.textSecondary }]}>Priority</Text>
          <View style={styles.priorityRow}>
            {([
              { key: "low", label: "Low", color: colors.priorityLow },
              { key: "medium", label: "Medium", color: colors.priorityMedium },
              { key: "high", label: "High", color: colors.priorityHigh },
            ] as const).map((item) => {
              const isSelected = priority === item.key;
              return (
                <Pressable
                  key={item.key}
                  onPress={() => setPriority(item.key)}
                  style={[
                    styles.priorityOption,
                    {
                      backgroundColor: isSelected ? item.color : colors.card,
                      borderColor: isSelected ? item.color : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      { color: isSelected ? "#FFFFFF" : colors.textSecondary },
                    ]}
                  >
                    {item.label.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Completion state toggle (ONLY EDIT MODE) */}
          {isEditMode && (
            <View style={[styles.toggleRow, { borderTopColor: colors.border }]}>
              <View>
                <Text style={[styles.toggleTitle, { color: colors.text }]}>Mark Completed</Text>
                <Text style={[styles.toggleSubtitle, { color: colors.textMuted }]}>
                  Toggle the overall completion state
                </Text>
              </View>
              <Pressable
                onPress={() => setCompleted(!completed)}
                style={({ pressed }) => [
                  styles.toggleSwitch,
                  {
                    backgroundColor: completed ? colors.success : colors.border,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.toggleCircle,
                    {
                      transform: [{ translateX: completed ? 22 : 2 }],
                    },
                  ]}
                />
              </Pressable>
            </View>
          )}

          {/* Action button */}
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.createButton,
              {
                backgroundColor: isSaveDisabled ? colors.border : colors.primary,
              },
              pressed && !isSaveDisabled && styles.pressed,
            ]}
            disabled={isSaveDisabled}
          >
            <Text style={styles.createButtonText}>
              {isEditMode ? "Save Changes" : "Create Task"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Custom Modal */}
      <DatePickerModal
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        selectedDate={dueDate}
        onSelectDate={setDueDate}
      />
    </SafeAreaView>
  );
}

const getFormattedSelected = (dateStr: string) => {
  if (!dateStr) return "Select Date";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    marginLeft: 4,
  },
  descriptionInput: {
    minHeight: 110,
  },
  datePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  datePickerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  fieldIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "500",
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  priorityRow: {
    flexDirection: "row",
    gap: 10,
  },
  priorityOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "800",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 12,
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  createButton: {
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.8,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
