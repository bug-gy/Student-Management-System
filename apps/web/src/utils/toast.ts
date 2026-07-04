import toast from "react-hot-toast";

export const showToast = {
  success: (msg: string) => toast.success(msg, { duration: 3000 }),
  error: (msg: string) => toast.error(msg, { duration: 5000 }),
  loading: (msg: string) => toast.loading(msg),
  dismiss: () => toast.dismiss(),
};
