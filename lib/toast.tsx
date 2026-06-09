import toast from "react-hot-toast";

export const notifyNoNote = () => {
  toast.error("No note found for your request.");
};