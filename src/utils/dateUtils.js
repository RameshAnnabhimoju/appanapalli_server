export const getStartDate = (fromDate) => {
  const currentDate = new Date();
  return fromDate
    ? new Date(fromDate).setHours(0, 0, 0, 0)
    : new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() > 0
          ? currentDate.getMonth() - 1
          : currentDate.getMonth()
      ).setHours(0, 0, 0, 0);
};
export const getEndDate = (ToDate) => {
  return ToDate
    ? new Date(ToDate).setHours(23, 59, 59, 999)
    : new Date().setHours(23, 59, 59, 999);
};
