export const calculateCrowdLevel = (occupancyPercentage) => {
  if (occupancyPercentage <= 30) {
    return 'Low';
  } else if (occupancyPercentage <= 70) {
    return 'Medium';
  } else {
    return 'High';
  }
};
