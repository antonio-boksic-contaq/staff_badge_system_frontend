export const addItemData = async (options, label) => {
  const keys = label.split("|");
  await options.map(async (x) => {
    let itemValue = "";
    await keys.forEach((e) => {
      if (e.includes(".")) {
        const splitted = e.split(".");
        itemValue += x[splitted[0]][splitted[1]] + " ";
      } else {
        itemValue += x[e] + " ";
      }
    });
    x.itemData = itemValue.slice(0, -1);
  });
  return options;
};
