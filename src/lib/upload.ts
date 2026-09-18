import { toast } from "sonner";

export const handleUpload = async (file: File, onSuccess: (url: string) => void) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      onSuccess(data.url);
    } else {
      toast.error("Upload failed");
    }
  } catch (err) {
    toast.error("Error uploading file");
    console.error(err);
  }
};
