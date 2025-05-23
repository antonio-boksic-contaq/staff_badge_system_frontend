export const getErrors = (object) => {
  if (Object.prototype.hasOwnProperty.call(object.response.data, "errors")) {
    let errors = [];
    Object.keys(object.response.data.errors).forEach(function (key) {
      errors.push(String(object.response.data.errors[key]));
    });
    return errors;
  }
};
