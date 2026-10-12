export function getGoalCalorieAdjustment(goal, hasConditionAddition = false) {
  if (hasConditionAddition) return 0

  return (
    {
      "Menurunkan berat badan": -300,
      "Menambah berat badan": 250,
      "Menjaga berat badan": 0,
    }[goal] ?? 0
  )
}
