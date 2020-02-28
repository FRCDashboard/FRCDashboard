var autonomousModes = {
  JustReverse: {
    value: "Reverse",
    name: "Only Reverse",
    description: "Reverse for 2 seconds, then stop.",
    setup: "Anywhere on line",
    states: [
      {
        name: "reverse"
      }
    ]
  },
  ShootReverse: {
    value: "ShootReverse",
    name: "Shoot and Reverse",
    description: "Shoot balls for 8 seconds, then back up for 2",
    setup: "Anywhere on line, shooter aimed at goal",
    states: [
      {
        name: "shoot",
        description: "Shoot for 8 seconds",
        first: true
      },
      {
        name: "reverse",
        description: "Reverse for 2 seconds at 50% speed"
      }
    ]
  }
};
