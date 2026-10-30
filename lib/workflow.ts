export const statuses = ["Submitted", "Acknowledged", "In progress", "Awaiting information", "Resolved"] as const;
export type Status = typeof statuses[number];
export const transitions: Record<Status, readonly Status[]> = {
  Submitted: ["Acknowledged"],
  Acknowledged: ["In progress", "Awaiting information"],
  "In progress": ["Awaiting information", "Resolved"],
  "Awaiting information": ["Acknowledged", "In progress"],
  Resolved: ["In progress"],
};
export function canTransition(from: string, to: string) {
  return (transitions[from as Status] ?? []).includes(to as Status);
}
export function validText(value: unknown, min: number, max: number): value is string {
  return typeof value === "string" && value.trim().length >= min && value.trim().length <= max && !value.includes("\u0000");
}
