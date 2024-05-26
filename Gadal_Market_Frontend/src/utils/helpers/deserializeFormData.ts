function deserializeFormData(serializedData: Record<string, any>): FormData {
    const formData = new FormData();
    Object.keys(serializedData).forEach((key) => {
      const value = serializedData[key];
      if (value && value.content && value.name) {
        const blob = new Blob([value.content], { type: value.type });
        const file = new File([blob], value.name, { type: value.type, lastModified: new Date().getTime() });
        formData.append(key, file);
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  }
export default deserializeFormData  