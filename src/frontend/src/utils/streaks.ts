export function computeStreaks(
  tasksByDate: Record<string, boolean>,
  currentDate: string
): { currentStreak: bigint; bestStreak: bigint } {
  const dates = Object.keys(tasksByDate).sort();
  if (dates.length === 0) return { currentStreak: 0n, bestStreak: 0n };

  let currentStreak = 0n;
  let bestStreak = 0n;
  let tempStreak = 0n;

  // Start from the most recent date and work backwards for current streak
  const currentDateObj = new Date(currentDate);
  let checkDate = new Date(currentDateObj);

  // Calculate current streak (must include today or yesterday)
  let foundToday = false;
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (tasksByDate[dateStr]) {
      currentStreak++;
      foundToday = true;
    } else if (foundToday) {
      break;
    } else {
      // If we haven't found any completed tasks yet and we hit a gap, streak is 0
      const daysDiff = Math.floor(
        (currentDateObj.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff > 1) break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
    if (dates.length > 0 && dateStr < dates[0]) break;
  }

  // Calculate best streak
  for (const date of dates) {
    if (tasksByDate[date]) {
      tempStreak++;
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    } else {
      tempStreak = 0n;
    }
  }

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  return { currentStreak, bestStreak };
}
