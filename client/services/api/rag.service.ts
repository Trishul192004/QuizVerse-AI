import api from "./axios";

export async function uploadDocument(file: File) {
  const formData = new FormData();

  // Must match upload.single("file")
  formData.append("file", file);

  const { data } = await api.post(
    "/rag/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export async function getDocuments() {
  const { data } = await api.get("/rag/documents");
  return data;
}

export async function deleteDocument(id: number) {
  const { data } = await api.delete(`/rag/document/${id}`);
  return data;
}