const compressBase64Image = async (base64: string): Promise<string> => {
  const img = new Image();
  img.src = base64;
  return new Promise((resolve) => {
    img.onload = () => {
      const parent = document.getElementById("test-id");
      const canvas = document.createElement("canvas");
      parent?.append(img);
      parent?.append(canvas);
      canvas.width = 200;
      canvas.height = 200;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, img.width, img.height, 0, 0, 200, 200);

      const result = canvas.toDataURL("image/jpeg", 0.9);
      resolve(result);
    };
  });
};

export { compressBase64Image };
