export const deviceList = [
  {
    id: 1,
    name: "Base Station 1",
    deviceInfo: [
      {
        id: 1,
        latitude: 24.8934,
        longitude: 67.0281,
        altitude: 30, // Example altitude in meters
        title: "University of Karachi",
        details: [
          "One of the largest universities in Pakistan",
          "Known for its research and diverse academic programs",
          "Established in 1951",
        ],
      },
      {
        id: 2,
        latitude: 24.9208,
        longitude: 67.0971,
        altitude: 20,
        title: "Jinnah International Airport",
        details: [
          "Busiest airport in Pakistan",
          "Named after Quaid-e-Azam Muhammad Ali Jinnah",
          "Serves both domestic and international flights",
        ],
      },
      {
        id: 3,
        latitude: 24.8975,
        longitude: 67.0745,
        altitude: 25,
        title: "Mazar-e-Quaid",
        details: [
          "Mausoleum of Quaid-e-Azam Muhammad Ali Jinnah",
          "A significant historical and tourist site",
          "Completed in 1971",
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Base Station 2",
    deviceInfo: [
      {
        id: 4,
        latitude: 24.8934,
        longitude: 67.0281,
        title: "University of Karachi",
        details: [
          "One of the busiest ports in South Asia",
          "Handles a large portion of Pakistan's trade",
          "Located near the Arabian Sea",
        ],
      },
      {
        id: 5,
        latitude: 24.9208,
        longitude: 67.0971,
        title: "Jinnah International Airport",
        details: [
          "Popular recreational park in Karachi",
          "Features a zoo, amusement rides, and picnic spots",
          "Established in 1970",
        ],
      },
      {
        id: 6,
        latitude: 24.8975,
        longitude: 67.0745,
        title: "Mazar-e-Quaid",
        details: [
          "Largest cricket stadium in Pakistan",
          "Hosts international and domestic cricket matches",
          "Capacity of around 34,000 spectators",
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Base Station 3",
    deviceInfo: [
      {
        id: 7,
        latitude: 24.8934,
        longitude: 67.0281,
        title: "University of Karachi",
        details: [
          "Historic market in Karachi built during British rule",
          "Famous for fresh produce and local goods",
          "Built in the 1880s",
        ],
      },
      {
        id: 8,
        latitude: 24.9208,
        longitude: 67.0971,
        title: "Jinnah International Airport",
        details: [
          "A historic palace built in 1927",
          "Now serves as a museum and cultural center",
          "Located in Clifton, Karachi",
        ],
      },
      {
        id: 9,
        latitude: 24.8975,
        longitude: 67.0745,
        title: "Mazar-e-Quaid",
        details: [
          "Former residence of Quaid-e-Azam Muhammad Ali Jinnah",
          "Preserved as a national museum",
          "Located in Karachi Cantonment area",
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Base Station 4",
    deviceInfo: [
      {
        id: 10,
        latitude: 24.8934,
        longitude: 67.0281,
        title: "University of Karachi",
        details: [
          "One of the largest shopping malls in Karachi",
          "Features international and local brands",
          "Located along the Clifton beach",
        ],
      },
      {
        id: 11,
        latitude: 24.9208,
        longitude: 67.0971,
        title: "Jinnah International Airport",
        details: [
          "One of the most famous beaches in Karachi",
          "Popular for families and tourists",
          "Offers camel and horse rides",
        ],
      },
      {
        id: 12,
        latitude: 24.8975,
        longitude: 67.0745,
        title: "Mazar-e-Quaid",
        details: [
          "Tallest skyscraper in Pakistan",
          "Located in Clifton, Karachi",
          "A mix of commercial and residential spaces",
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Base Station 5",
    deviceInfo: [
      {
        id: 13,
        latitude: 24.8607,
        longitude: 67.0011,
        altitude: 10,
        title: "Karachi Port",
        details: [
          "One of the busiest ports in South Asia",
          "Handles a large portion of Pakistan's trade",
          "Located near the Arabian Sea",
        ],
      },
      {
        id: 14,
        latitude: 24.9276,
        longitude: 67.0325,
        altitude: 15,
        title: "Safari Park",
        details: [
          "Popular recreational park in Karachi",
          "Features a zoo, amusement rides, and picnic spots",
          "Established in 1970",
        ],
      },
      {
        id: 15,
        latitude: 24.8915,
        longitude: 67.0652,
        altitude: 18,
        title: "National Stadium",
        details: [
          "Largest cricket stadium in Pakistan",
          "Hosts international and domestic cricket matches",
          "Capacity of around 34,000 spectators",
        ],
      },
    ],
  },
  {
    id: 6,
    name: "Base Station 6",
    deviceInfo: [
      {
        id: 16,
        latitude: 24.8532,
        longitude: 67.0167,
        altitude: 14,
        title: "Merewether Tower",
        details: [
          "A historical landmark in Karachi",
          "Built in the 19th century during British rule",
          "Located near I.I. Chundrigar Road",
        ],
      },
      {
        id: 17,
        latitude: 24.9361,
        longitude: 67.0196,
        altitude: 19,
        title: "PAF Museum",
        details: [
          "Museum dedicated to the Pakistan Air Force",
          "Displays aircraft, weapons, and aviation history",
          "Located near Shahrah-e-Faisal",
        ],
      },
      {
        id: 18,
        latitude: 24.8608,
        longitude: 67.0647,
        altitude: 21,
        title: "Frere Hall",
        details: [
          "Historic building from the British colonial era",
          "Now used as an art gallery and library",
          "Built in 1865",
        ],
      },
    ],
  },
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
