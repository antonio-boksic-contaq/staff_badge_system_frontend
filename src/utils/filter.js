export const filterRadioButton = async (e, apiStore, props) => {
  const { name, value } = e.target;
  if (value != 0 || name !== "trashed") {
    const names = name.split("_");
    apiStore.params = {
      ...apiStore.params,
      [names[0]]: value,
    };
  } else {
    if (
      apiStore.params !== null &&
      Object.prototype.hasOwnProperty.call(apiStore.params, name)
    )
      delete apiStore.params[name];
  }
  const response = await apiStore.fetch(props.url, apiStore.params);
  return response;
};

export const filterParams = async (name, data, apiStore, props) => {
  if (data.length === 0) {
    if (
      apiStore.params !== null &&
      Object.prototype.hasOwnProperty.call(apiStore.params, name)
    )
      delete apiStore.params[name];
  } else {
    const params = {
      [name]: data,
    };
    apiStore.params = {
      ...apiStore.params,
      ...params,
    };
  }

  const response = await apiStore.fetch(props.url, apiStore.params);
  return response;
};

export const setTableFilters = (tableFilter, apiStore) => {
  Object.keys(tableFilter).forEach((key) => {
    if (!(key in apiStore.params)) {
      delete tableFilter[key];
    }
  });

  Object.assign(tableFilter, apiStore.params);

  return tableFilter;
};

export const monthOptions = [
  {
    id: 1,
    month: "Gennaio",
  },
  {
    id: 2,
    month: "Febbraio",
  },
  {
    id: 3,
    month: "Marzo",
  },
  {
    id: 4,
    month: "Aprile",
  },
  {
    id: 5,
    month: "Maggio",
  },
  {
    id: 6,
    month: "Giugno",
  },
  {
    id: 7,
    month: "Luglio",
  },
  {
    id: 8,
    month: "Agosto",
  },
  {
    id: 9,
    month: "Settembre",
  },
  {
    id: 10,
    month: "Ottobre",
  },
  {
    id: 11,
    month: "Novembre",
  },
  {
    id: 12,
    month: "Dicembre",
  },
];
