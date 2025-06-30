import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import TextBalance from "../components/text-balance";

export const Profile = () => {
  const { t } = useTranslation();
  const user = sessionStorage.getItem("tgUser");

  return (
    <div className="bg-white">
      <section>
        <div className="flex items-center bg-white p-2 px-4 justify-between">
          <Link
            to={"/"}
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
            {t("profile.title")}
          </h2>
        </div>
      </section>

      <section>
        <div>
          <div className="flex p-4 @container">
            <div className="flex w-full flex-col gap-4">
              <div className="flex gap-4">
                <div className="w-16 aspect-square overflow-hidden rounded-full">
                  <img
                    className="object-cover w-full h-full"
                    src={user ? JSON.parse(atob(user)).photo_url : ""}
                  />
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col justify-center">
                    <p className="text-[#181811] text-[18px] font-bold leading-tight tracking-[-0.015em]">
                      {user ? JSON.parse(atob(user)).first_name : ""}
                    </p>
                    <TextBalance />
                  </div>
                  <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#d6d604] text-[#181811] text-sm font-medium leading-normal capitalize"
                    onClick={() => window.location.reload()}
                  >
                    <span>{t("refresh")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-[#181811] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            {t("profile.support_title")}
          </h3>
          <Link to="https://t.me/TezDonatchiAdmin" className="flex items-center gap-4 bg-white px-4 min-h-14">
            <div
              className="text-[#181811] flex items-center justify-center rounded-lg bg-[#f5f5f0] shrink-0 size-10"
              data-icon="Question"
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
                <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
              </svg>
            </div>
            <p className="text-[#181811] text-base font-normal leading-normal flex-1 truncate">
              {t("profile.support")}
            </p>
            <div className="text-[#181811] flex items-center justify-center shrink-0 size-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16px"
                height="16px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="m221.66,133.66-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
              </svg>
            </div>
          </Link>

          <Link
            to="/replenish"
            className="flex items-center gap-4 bg-white px-4 min-h-14 hover:bg-gray-50 transition-colors"
          >
            <div
              className="text-[#181811] flex items-center justify-center rounded-lg bg-[#f5f5f0] shrink-0 size-10"
              data-icon="CreditCard"
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
                <path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM32,64H224V88H32ZM32,192V104H224v88ZM128,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H136A8,8,0,0,1,128,136Zm0,32a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H136A8,8,0,0,1,128,168ZM64,136a8,8,0,0,1,8-8H88a8,8,0,0,1,0,16H72A8,8,0,0,1,64,136Z"></path>
              </svg>
            </div>
            <p className="text-[#181811] text-base font-normal leading-normal flex-1 truncate">
              {t("profile.replenish")}
            </p>
            <div className="text-[#181811] flex items-center justify-center shrink-0 size-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16px"
                height="16px"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="m221.66,133.66-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
              </svg>
            </div>
          </Link>
          
        </div>
      </section>
    </div>
  );
};