import { useState, useEffect } from "react";

import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Route } from "../routes/game/$gameSlug/checkout";

interface Price {
  price: number;
  currency: string;
  currency_ru: string;
  currency_en: string;
}

interface Tag {
  name: string;
}

interface MerchandiseItem {
  id: number;
  name: string;
  name_ru: string;
  name_en: string;
  category: string;
  slug: string;
  prices: Price[];
  tags?: Tag[];
  server: string;
}

interface Server {
  name: string;
  name_ru: string;
  name_en: string;
  slug: string;
}

interface Category {
  name: string;
  name_ru: string;
  name_en: string;
  description: string;
  description_ru: string;
  description_en: string;
  slug: string;
}

interface Game {
  name: string;
  name_ru: string;
  name_en: string;
  slug: string;
  image_path: string;
  servers: Server[];
  merchandise: MerchandiseItem[];
  categories: Category[];
  inputs?: string; // Dynamic inputs like "userId,serverId"
}

interface GameData {
  game: Game;
}

interface Quantities {
  [key: string]: number;
}

interface CheckoutItem {
  item: MerchandiseItem;
  quantity: number;
  itemKey: string;
}

interface DynamicInputs {
  [key: string]: string;
}

export const Checkout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { gameSlug } = Route.useParams();
  const { gameData }: { gameData: GameData } = Route.useLoaderData();

  const [dynamicInputs, setDynamicInputs] = useState<DynamicInputs>({});
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [quantities, setQuantities] = useState<Quantities>({});
  const [shouldUpdateURL, setShouldUpdateURL] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [purchaseStatus, setPurchaseStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const user = sessionStorage.getItem("tgUser");

  // Parse dynamic inputs from game data
  const inputFields = gameData.game.inputs
    ? gameData.game.inputs.split(",").map((field) => field.trim())
    : [];

  // Parse URL parameters to get selected items
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedItems: CheckoutItem[] = [];
    const initialQuantities: Quantities = {};

    urlParams.forEach((quantity, itemKey) => {
      const qty = parseInt(quantity);
      if (qty > 0) {
        // Find the merchandise item by slug or fallback method
        const item = gameData.game.merchandise.find(
          (merch) =>
            merch.slug === itemKey ||
            `${merch.category}-${gameData.game.merchandise.indexOf(merch)}` ===
              itemKey
        );

        if (item) {
          selectedItems.push({
            item,
            quantity: qty,
            itemKey,
          });
          initialQuantities[itemKey] = qty;
        }
      }
    });

    setCheckoutItems(selectedItems);
    setQuantities(initialQuantities);
  }, [gameData.game.merchandise]);

  // Effect to update URL when quantities change
  useEffect(() => {
    if (!shouldUpdateURL) return;

    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams();

    // Add all non-zero quantities to search params
    Object.entries(quantities).forEach(([itemKey, quantity]) => {
      if (quantity > 0) {
        searchParams.set(itemKey, quantity.toString());
      }
    });

    // Update the URL without triggering a page reload
    const newUrl = `${url.pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;
    window.history.replaceState({}, "", newUrl);

    setShouldUpdateURL(false);
  }, [quantities, shouldUpdateURL]);

  const updateQuantity = (itemKey: string, change: number): void => {
    setQuantities((prev) => {
      const newQuantity = Math.max(0, (prev[itemKey] || 0) + change);
      const newQuantities = {
        ...prev,
        [itemKey]: newQuantity,
      };

      // Remove item from quantities if quantity becomes 0
      if (newQuantity === 0) {
        delete newQuantities[itemKey];
      }

      return newQuantities;
    });

    // Update checkout items
    setCheckoutItems((prev) =>
      prev
        .map((checkoutItem) =>
          checkoutItem.itemKey === itemKey
            ? {
                ...checkoutItem,
                quantity: Math.max(0, checkoutItem.quantity + change),
              }
            : checkoutItem
        )
        .filter((item) => item.quantity > 0)
    );

    // Trigger URL update
    setShouldUpdateURL(true);
  };

  const removeItem = (itemKey: string): void => {
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[itemKey];
      return updated;
    });

    setCheckoutItems((prev) => prev.filter((item) => item.itemKey !== itemKey));

    // Trigger URL update
    setShouldUpdateURL(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getCurrentLanguageName = (item: any) => {
    const currentLang = i18n.language;
    if (currentLang === "ru" && item.name_ru) return item.name_ru;
    if (currentLang === "en" && item.name_en) return item.name_en;
    return item.name;
  };

  // Handle dynamic input changes
  const handleInputChange = (inputKey: string, value: string): void => {
    setDynamicInputs((prev) => ({
      ...prev,
      [inputKey]: value,
    }));
  };

  // Check if all required inputs are filled
  const areAllInputsFilled = (): boolean => {
    // If there are no input fields, return true
    if (inputFields.length === 0) return true;
    
    // Check if all input fields have non-empty values
    return inputFields.every((field) => dynamicInputs[field]?.trim() !== "");
  };

  // Calculate total
  const calculateTotal = () => {
    return checkoutItems.reduce((total, checkoutItem) => {
      return (
        total +
        (checkoutItem.item.prices[0]?.price || 0) * checkoutItem.quantity
      );
    }, 0);
  };

  // Handle purchase
  const handlePurchase = async () => {
    if (!user) return;

    if (!areAllInputsFilled() || checkoutItems.length === 0) {
      return;
    }

    setIsProcessing(true);
    setPurchaseStatus(null);

    try {
      const cart = checkoutItems
        .map((item) => `${item.item.id}:${item.quantity}`)
        .join(",");

      const inputs = inputFields
        .map((field) => `${field}:${dynamicInputs[field]}`)
        .join(",");

      const searchparams = new URLSearchParams({
        inputs,
        cart,
      });

      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/buy/?" + searchparams,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-User-ID": user,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setPurchaseStatus({
          success: true,
          message:
            result.message ||
            t("checkout.purchase_success"),
        });

        // Clear the cart and inputs after successful purchase
        setCheckoutItems([]);
        setQuantities({});
        setDynamicInputs({});

        // Update URL to remove cart items
        const url = new URL(window.location.href);
        window.history.replaceState({}, "", url.pathname);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setPurchaseStatus({
          success: false,
          message:
            errorData.message ||
            t("checkout.purchase_error"),
        });
      }
    } catch (error) {
      console.error("Purchase error:", error);
      setPurchaseStatus({
        success: false,
        message:
          t("checkout.network_error"),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = calculateTotal();
  const currency = checkoutItems[0]?.item.prices[0]?.currency || "";

  // Check if purchase button should be disabled
  const isPurchaseDisabled = isProcessing || checkoutItems.length === 0 || !areAllInputsFilled();

  return (
    <div className="bg-white">
      <div className="flex items-center bg-white px-4 py-2 justify-between">
        <Link
          to={`/game/${gameSlug}/`}
          className="text-[#161613] flex size-12 shrink-0 items-center"
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
        <h2 className="text-[#161613] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          {t("checkout.title")}
        </h2>
      </div>

      {/* Purchase Status Message */}
      {purchaseStatus && (
        <div
          className={`mx-4 my-3 p-3 rounded-xl ${
            purchaseStatus.success
              ? "bg-green-100 border border-green-300 text-green-800"
              : "bg-red-100 border border-red-300 text-red-800"
          }`}
        >
          <p className="text-sm font-medium">{purchaseStatus.message}</p>
        </div>
      )}

      {/* Dynamic Input Fields */}
      {inputFields.map((inputKey) => (
        <div
          key={inputKey}
          className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3"
        >
          <label className="flex flex-col min-w-40 flex-1">
            <p className="text-[#161613] text-base font-medium leading-normal pb-2">
              {inputKey} <span className="text-red-500">*</span>
            </p>
            <input
              placeholder={t(`checkout.input_placeholder`, {"input": inputKey})}
              value={dynamicInputs[inputKey] || ""}
              onChange={(e) => handleInputChange(inputKey, e.target.value)}
              disabled={isProcessing}
              required
              type={
                inputKey === "email"
                  ? "email"
                  : inputKey === "phoneNumber"
                    ? "tel"
                    : "text"
              }
              className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#161613] focus:outline-0 focus:ring-0 border-none focus:border-none h-14 placeholder:text-[#80806b] p-4 text-base font-normal leading-normal disabled:opacity-50 ${
                dynamicInputs[inputKey]?.trim() === "" && inputFields.length > 0
                  ? "bg-red-50 border border-red-200"
                  : "bg-[#f3f3f1]"
              }`}
            />
          </label>
        </div>
      ))}

      {/* Warning message for missing required fields */}
      {inputFields.length > 0 && !areAllInputsFilled() && checkoutItems.length > 0 && (
        <div className="mx-4 my-3 p-3 rounded-xl bg-yellow-100 border border-yellow-300 text-yellow-800">
          <p className="text-sm font-medium">
            {t("checkout.required_fields_warning") || "Please fill in all required fields to complete your purchase."}
          </p>
        </div>
      )}

      {/* Selected Merchandise */}
      {checkoutItems.length > 0 && (
        <div className="px-4 py-3">
          <h3 className="text-[#161613] text-lg font-bold leading-tight tracking-[-0.015em] pb-3">
            {t("checkout.selected_items") || "Selected Items"}
          </h3>

          <div className="bg-white rounded-xl border border-[#e6e6db] overflow-hidden">
            {checkoutItems.map((checkoutItem, index) => (
              <div
                key={checkoutItem.itemKey}
                className={`flex items-center gap-4 px-4 py-3 ${index !== checkoutItems.length - 1 ? "border-b border-[#e6e6db]" : ""}`}
              >
                <div className="flex-1">
                  <p className="text-[#161613] text-base font-medium leading-normal">
                    {getCurrentLanguageName(checkoutItem.item)}
                  </p>
                  <p className="text-[#80806b] text-sm font-normal leading-normal">
                    {checkoutItem.item.prices[0]?.price.toLocaleString()}{" "}
                    {checkoutItem.item.prices[0]?.currency}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      className={`text-base font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f3f1] cursor-pointer hover:bg-[#e6e6db] disabled:opacity-50 disabled:cursor-not-allowed ${checkoutItem.quantity === 1 ? "opacity-0" : ""}`}
                      onClick={() =>
                        checkoutItem.quantity !== 1 &&
                        updateQuantity(checkoutItem.itemKey, -1)
                      }
                      disabled={isProcessing}
                    >
                      -
                    </button>

                    <span className="text-base font-medium leading-normal min-w-[2rem] text-center">
                      {checkoutItem.quantity}
                    </span>
                    <button
                      className="text-base font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f3f1] cursor-pointer hover:bg-[#e6e6db] disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => updateQuantity(checkoutItem.itemKey, 1)}
                      disabled={isProcessing}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => removeItem(checkoutItem.itemKey)}
                    disabled={isProcessing}
                    title={t("checkout.remove_item") || "Remove item"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="bg-[#f8f8f6] px-4 py-3 border-t border-[#e6e6db]">
              <div className="flex justify-between items-center">
                <span className="text-[#161613] text-lg font-bold">
                  {t("checkout.total") || "Total"}
                </span>
                <span className="text-[#161613] text-lg font-bold">
                  {totalAmount.toLocaleString()} {currency}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {checkoutItems.length === 0 && (
        <Link to={`/game/${gameSlug}/`} className="px-4 py-8 text-center">
          <p className="text-[#80806b] text-base">
            {t("checkout.no_items")}
          </p>
        </Link>
      )}

      {/* Checkout Button */}
      {checkoutItems.length > 0 && (
        <div className="flex px-4 py-3">
          <button
            className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 text-base font-bold leading-normal tracking-[0.015em] transition-colors ${
              isPurchaseDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#d6d604] text-[#161613] hover:bg-[#c4c404]"
            }`}
            onClick={handlePurchase}
            disabled={isPurchaseDisabled}
          >
            <span className="truncate">
              {isProcessing
                ? t("checkout.processing")
                : t("checkout.complete_purchase") ||
                  `Complete Purchase (${totalAmount.toLocaleString()} ${currency})`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};