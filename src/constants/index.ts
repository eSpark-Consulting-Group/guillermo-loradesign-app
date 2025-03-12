export const deviceList = [
  { id: 1, name: "Base Station 1" },
  { id: 2, name: "Base Station 2" },
  { id: 3, name: "Base Station 3" },
  { id: 4, name: "Base Station 4" },
  { id: 5, name: "Base Station 5" },
  { id: 6, name: "Base Station 6" },
  { id: 7, name: "Base Station 7" },
];

export const settingsOptions = [
  {
    id: 1,
    text: "Master Data Export",
    icon: "download",
    onPress: () => {
      console.log("Master Data Export");
    },
  },
  {
    id: 2,
    text: "Bluetooth Status",
    icon: "info-circle",
    onPress: () => {
      console.log("Bluetooth Status");
    },
  },
  {
    id: 3,
    text: "Current Date For Map Display",
    icon: "chevron-down",
    onPress: () => {
      console.log("Current Date For Map Display");
    },
  },
];
