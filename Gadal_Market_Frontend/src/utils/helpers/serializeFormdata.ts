function serializeFormData(formData: FormData): Promise<Record<string, any>> {
    return new Promise((resolve) => {
      const object: Record<string, any> = {};
      const promises: Promise<void>[] = [];
      formData.forEach((value, key) => {
        if (value instanceof File) {
          promises.push(
            new Promise((fileResolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                object[key] = {
                  name: value.name,
                  type: value.type,
                  size: value.size,
                  content: reader.result,
                };
                fileResolve();
              };
              reader.readAsDataURL(value);
            })
          );
        } else {
          object[key] = value;
        }
      });
  
      Promise.all(promises).then(() => resolve(object));
    });
  }
  export default serializeFormData