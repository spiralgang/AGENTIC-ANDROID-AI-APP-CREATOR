export interface AndroidFile {
  path: string;
  content: string;
}

export interface SimulatedUIElement {
  type: "button" | "input" | "label" | "list_container" | "status_indicator" | "switch" | "card_button" | string;
  label: string;
  id: string;
  actionType?: "append" | "clear" | "toggle" | "add_list" | "toast" | "none" | string;
  placeholder?: string;
  value?: string;
}

export interface SimulatedUIScreen {
  title: string;
  elements: SimulatedUIElement[];
}

export interface SimulatedUI {
  themeColor: string;
  textColor: string;
  layoutType: string; // calculator, notepad, flashlight, etc.
  screens: SimulatedUIScreen[];
}

export interface AndroidProject {
  appName: string;
  packageName: string;
  files: AndroidFile[];
  features: string[];
  simulatedBuildOutputs: string[];
  simulatedUI: SimulatedUI;
}

export interface SavedTemplate {
  name: string;
  description: string;
  project: AndroidProject;
  savedAt: string;
}

export interface HistoryItem {
  id: string;
  appName: string;
  description: string;
  timestamp: string;
  project: AndroidProject;
}
