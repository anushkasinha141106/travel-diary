import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post("/travel-story/image-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading image", error);
    if(error.code==="ECONNABORTED"){
      throw new Error("Server s waking up, Please wait a minute and try again.");
    }
    throw error;
  }
};

export default uploadImage;
