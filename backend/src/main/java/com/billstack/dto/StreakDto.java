package com.billstack.dto;

public class StreakDto {

    private int currentWeekStreak;
    private int currentMonthStreak;
    private long totalReceiptsOrganized;
    private String label;

    public StreakDto() {}

    public StreakDto(int currentWeekStreak, int currentMonthStreak, long totalReceiptsOrganized, String label) {
        this.currentWeekStreak = currentWeekStreak;
        this.currentMonthStreak = currentMonthStreak;
        this.totalReceiptsOrganized = totalReceiptsOrganized;
        this.label = label;
    }

    public int getCurrentWeekStreak() { return currentWeekStreak; }
    public void setCurrentWeekStreak(int currentWeekStreak) { this.currentWeekStreak = currentWeekStreak; }

    public int getCurrentMonthStreak() { return currentMonthStreak; }
    public void setCurrentMonthStreak(int currentMonthStreak) { this.currentMonthStreak = currentMonthStreak; }

    public long getTotalReceiptsOrganized() { return totalReceiptsOrganized; }
    public void setTotalReceiptsOrganized(long totalReceiptsOrganized) { this.totalReceiptsOrganized = totalReceiptsOrganized; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
}
