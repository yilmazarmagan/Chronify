export interface AppSettings {
  theme: "dark" | "light" | "auto";
  primaryColor: string;
  locale: "en" | "tr";
  defaultView: "timer" | "timesheet";
  weekStartsOn: "monday" | "sunday";
}
