import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "../hooks/useAppTheme";

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function DatePickerModal({
  visible,
  onClose,
  selectedDate,
  onSelectDate,
}: Props) {
  const { colors } = useAppTheme();
  
  // Track calendar view state (which year/month are we looking at)
  const initialDate = useMemo(() => {
    return selectedDate ? new Date(selectedDate) : new Date();
  }, [selectedDate]);
  
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-indexed

  // Calculate calendar days
  const calendarCells = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const cells = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const year = currentMonth === 0 ? currentYear - 1 : currentYear;
      const month = currentMonth === 0 ? 11 : currentMonth - 1;
      cells.push({
        day: daysInPrevMonth - i,
        month,
        year,
        isCurrentMonth: false,
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
      });
    }

    // Next month padding
    const totalRemaining = 42 - cells.length; // 6 rows of 7
    for (let i = 1; i <= totalRemaining; i++) {
      const year = currentMonth === 11 ? currentYear + 1 : currentYear;
      const month = currentMonth === 11 ? 0 : currentMonth + 1;
      cells.push({
        day: i,
        month,
        year,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const selectDateStr = (year: number, month: number, day: number) => {
    const mStr = String(month + 1).padStart(2, "0");
    const dStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${mStr}-${dStr}`;
    onSelectDate(dateStr);
    onClose();
  };

  // Shortcuts
  const setToday = () => {
    const today = new Date();
    selectDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const setTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    selectDateStr(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  };

  const setNextWeek = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    selectDateStr(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate());
  };

  // Format date for display in input or headers
  const getFormattedSelected = () => {
    if (!selectedDate) return "None";
    const d = new Date(selectedDate);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Select Due Date</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Quick Shortcuts */}
          <View style={styles.shortcuts}>
            <Pressable
              onPress={setToday}
              style={[styles.shortcutBtn, { backgroundColor: colors.primaryLight }]}
            >
              <Text style={[styles.shortcutText, { color: colors.primary }]}>Today</Text>
            </Pressable>

            <Pressable
              onPress={setTomorrow}
              style={[styles.shortcutBtn, { backgroundColor: colors.primaryLight }]}
            >
              <Text style={[styles.shortcutText, { color: colors.primary }]}>Tomorrow</Text>
            </Pressable>

            <Pressable
              onPress={setNextWeek}
              style={[styles.shortcutBtn, { backgroundColor: colors.primaryLight }]}
            >
              <Text style={[styles.shortcutText, { color: colors.primary }]}>Next Week</Text>
            </Pressable>
          </View>

          {/* Calendar Controller */}
          <View style={styles.calendarNav}>
            <Pressable onPress={handlePrevMonth} style={styles.navBtn}>
              <Feather name="chevron-left" size={22} color={colors.textSecondary} />
            </Pressable>
            
            <Text style={[styles.navMonth, { color: colors.text }]}>
              {MONTHS[currentMonth]} {currentYear}
            </Text>
            
            <Pressable onPress={handleNextMonth} style={styles.navBtn}>
              <Feather name="chevron-right" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Weekdays Header */}
          <View style={styles.weekdaysRow}>
            {WEEKDAYS.map((day) => (
              <Text key={day} style={[styles.weekdayText, { color: colors.textMuted }]}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.grid}>
            {calendarCells.map((cell, index) => {
              const dateStr = `${cell.year}-${String(cell.month + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
              const isSelected = selectedDate === dateStr;
              
              return (
                <Pressable
                  key={index}
                  onPress={() => selectDateStr(cell.year, cell.month, cell.day)}
                  style={[
                    styles.cell,
                    isSelected && { backgroundColor: colors.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.cellText,
                      { color: cell.isCurrentMonth ? colors.text : colors.textMuted },
                      isSelected && { color: "#FFFFFF", fontWeight: "700" },
                    ]}
                  >
                    {cell.day}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Selected Date Summary */}
          <View style={[styles.summaryFooter, { borderTopColor: colors.border }]}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Selected Date:</Text>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>
              {getFormattedSelected()}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeBtn: {
    padding: 4,
  },
  shortcuts: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  shortcutBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  shortcutText: {
    fontSize: 14,
    fontWeight: "600",
  },
  calendarNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  navBtn: {
    padding: 8,
  },
  navMonth: {
    fontSize: 16,
    fontWeight: "700",
  },
  weekdaysRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },
  cell: {
    width: "14.28%", // 7 columns
    aspectRatio: 1.1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 2,
  },
  cellText: {
    fontSize: 14,
    fontWeight: "500",
  },
  summaryFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
  },
});
