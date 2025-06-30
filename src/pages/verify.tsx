import { useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { Link } from "@tanstack/react-router";

export const Verify = () => {
  const { t } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = sessionStorage.getItem("tgUser") as any;

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clear any previous errors
      setError("");
      setSubmitSuccess(false);

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError(
          `File size (${formatFileSize(file.size)}) exceeds the 5MB limit. Please choose a smaller image.`
        );
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      console.log("Selected file:", file);
      setFileName(file.name);
      setSelectedFile(file);

      // Create a URL for the uploaded image to display it
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
      setSelectedFile(null);
      setFileName("");
      setError("");
      setSubmitSuccess(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setError("");
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!amount.trim()) {
      setError("Please enter an amount.");
      return;
    }

    if (!selectedFile) {
      setError("Please upload a cheque image.");
      return;
    }

    setError("");
    setSubmitSuccess(false);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("amount", amount.trim());
      formData.append("image", selectedFile);

      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/verify/",
        {
          headers: {
            "X-User-ID": user,
          },
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Verification submitted successfully:", result);
      setSubmitSuccess(true);

      // Optionally reset form after successful submission
      setAmount("");
      handleRemoveImage();
    } catch (err) {
      console.error("Error submitting verification:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit verification. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="flex items-center p-2 px-4 justify-between">
        <Link
          to="/replenish"
          className="text-[#181811] flex size-12 shrink-0 items-center"
          data-icon="ArrowLeft"
          data-size="24px"
          data-weight="regular"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
          </svg>
        </Link>
        <h2 className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          {t("verify.title")}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <h3 className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-2">
          {t("verify.amount")}
        </h3>
        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
          <label className="flex flex-col min-w-40 flex-1">
            <input
              type="number"
              min="1000"
              placeholder={t("verify.amount_placeholder")}
              value={amount}
              onChange={handleAmountChange}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181811] focus:outline-0 focus:ring-0 border-none bg-[#f5f5f0] focus:border-none h-14 placeholder:text-[#8c8c5f] p-4 text-base font-normal leading-normal"
              disabled={isSubmitting}
            />
          </label>
        </div>

        <h3 className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          {t("verify.cheque")}
        </h3>

        <div className="flex flex-col p-4">
          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="text-green-500 mt-0.5 shrink-0"
                >
                  <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                </svg>
                <p className="text-green-700 text-sm font-medium">
                  {t("verify.success")}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  className="text-red-500 mt-0.5 shrink-0"
                >
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path>
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {!selectedImage ? (
            <div
              className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#e6e6db] px-6 py-14 cursor-pointer hover:bg-[#fafaf7] transition-colors"
              onClick={handleUploadClick}
            >
              <div className="flex max-w-[480px] flex-col items-center gap-2">
                <p className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                  {t("verify.upload_cheque")}
                </p>
                <p className="text-[#181811] text-sm font-normal leading-normal max-w-[480px] text-center">
                  {t("verify.upload_cheque_description")}
                </p>
                <p className="text-[#8c8c5f] text-xs font-normal leading-normal max-w-[480px] text-center">
                  {t('verify.upload_cheque_size', { size: formatFileSize(MAX_FILE_SIZE)} )}
                </p>
              </div>

              <button
                type="button"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f5f5f0] text-[#181811] text-sm font-bold leading-normal tracking-[0.015em]"
                disabled={isSubmitting}
              >
                <span className="truncate">{t("verify.upload")}</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 rounded-xl border border-[#e6e6db] p-4 bg-[#fafaf7]">
              <div className="flex items-center justify-between">
                <p className="text-[#181811] text-sm font-medium">{fileName}</p>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                  disabled={isSubmitting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="text-red-600"
                  >
                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                  </svg>
                </button>
              </div>

              <div className="rounded-lg overflow-hidden border border-[#e6e6db]">
                <img
                  src={selectedImage}
                  alt="Uploaded cheque"
                  className="w-full h-auto max-h-96 object-contain bg-white"
                />
              </div>

              <button
                type="button"
                onClick={handleUploadClick}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f5f5f0] text-[#181811] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e6e6db] transition-colors"
                disabled={isSubmitting}
              >
                <span className="truncate">{t("verify.upload")}</span>
              </button>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex px-4 py-3">
          <button
            type="submit"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#d6d604] text-[#181811] text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !amount.trim() || !selectedFile}
          >
            <span className="truncate">
              {isSubmitting ? t("verify.submitting") : t('verify.submit')}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
