import { IoLocationSharp } from "react-icons/io5";
import InputField from "../appCommon/InputField";
import SelectField from "../appCommon/SelectField";
import { useTranslations } from "next-intl";
import { showToast } from "@/utils/helper";

const GiftForm = ({
  values,
  errors,
  touched,
  handleChange,
  selectedCountry,
  handleClickOpen,
  setIsGiftSaved,
  setIsOpen,
  selectedOption,
  handleSubmit,
  areaLoading = false,
  cities = [],
  areas = [],
  getCity,
  validateForm,
  handlePriview,
  setChekOutMapVisible,
}) => {
  const t = useTranslations("");
  return (
    <div>
      <div>
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4`}>
          <InputField
            name="sender_name"
            value={values?.sender_name}
            onChange={handleChange}
            placeholder="Sender Name"
            error={errors?.sender_name}
            touched={touched?.sender_name}
          />

          <InputField
            name="name"
            value={values?.name}
            onChange={handleChange}
            placeholder="Receiver Name"
            error={errors.name}
            touched={touched.name}
          />
          <div className="flex w-full gap-2">
            <select
              name="country_code"
              disabled
              value={selectedCountry?.code || ""}
              className="border border-gray-300 px-2 rounded-sm text-sm"
            >
              <option value={selectedCountry?.code || ""}>
                {selectedCountry?.code}
              </option>
            </select>
            <InputField
              name="mobile_number"
              value={values?.mobile_number}
              onChange={handleChange}
              placeholder="Receiver Number"
              error={errors.mobile_number}
              touched={touched.mobile_number}
              type="number"
              className="rounded-sm w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <SelectField
          name="city_id"
          value={values.city_id}
          onChange={(event) => {
            let value = event.target.value;
            handleChange("city_id")(value);
            handleChange("area_id")("");
            getCity(value);
          }}
          options={cities.map((city) => ({
            label: city.city_name,
            value: city.id,
          }))}
          placeholder={t("select_city")}
          error={errors.city_id}
          touched={touched.city_id}
        />

        <SelectField
          name="area_id"
          value={values.area_id}
          onChange={handleChange}
          options={areas.map((area) => ({
            label: area.area_name,
            value: area.id,
          }))}
          loading={areaLoading}
          placeholder={t("select_area")}
          error={errors.area_id}
          touched={touched.area_id}
          disabled={!values.city_id}
        />
      </div>

      <div>
        <textarea
          name="message"
          value={values?.message}
          onChange={handleChange}
          placeholder="Gift Message"
          className="border border-gray-300 px-3 py-2 rounded w-full mb-1 h-20"
        />
        {touched.message && errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message}</p>
        )}
      </div>

      {selectedOption === 3 && (
        <div>
          <div className="mb-4">
            <InputField
              name="note"
              value={values.note}
              onChange={handleChange}
              placeholder="Note"
              error={errors.note}
              touched={touched.note}
            />
          </div>
          <div className="mb-2 flex gap-2 items-center">
            <IoLocationSharp className="text-gray-500 text-2xl" />
            <button
              type="button"
              className="bg-[#bb1f2a] text-white px-4 py-2 text-xs rounded cursor-pointer"
              onClick={() => {
                setChekOutMapVisible(true);
              }}
            >
              Address
            </button>
          </div>

          <InputField
            name="address"
            value={values.address}
            onChange={handleChange}
            placeholder="Enter a location"
            error={errors.address}
            touched={touched.address}
          />
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            handlePriview();
          }}
          className="bg-[#bb1f2a] text-white px-4 py-2 text-xs rounded-xm cursor-pointer"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={async () => {
            validateForm().then((errors) => {
              if (Object.keys(errors).length === 0) {
                setIsOpen(false);
                setTimeout(() => {
                  handleClickOpen();
                }, 100);
              } else {
                Object.keys(errors).map((key) => {
                  errors[key] && showToast("error", errors[key]);
                });
              }
            });
          }}
          className="bg-[#bb1f2a] text-white px-4 py-2 text-xs rounded-xs cursor-pointer"
        >
          Save & Preview
        </button>
      </div>
    </div>
  );
};

export default GiftForm;
