import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import GiftForm from "./GiftForm";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Radio,
} from "@mui/material";
import { useState } from "react";
import ChekOutMap from "../Map/ChekOutMap";

const GiftDialog = ({
  isOpen,
  setIsOpen,
  gift,
  selectedOption,
  handleOptionChange,
  values,
  errors,
  touched,
  handleChange,
  handleSubmit,
  handleClickOpen,
  setIsGiftSaved,
  selectedCountry,
  imageLink,
  cities,
  areas,
  getCity,
  validateForm,
  setFieldValue,
  handlePriview,
  currentLocation,
  handleDragEnd,
  locationSelected,
}) => {
  const [chekOutMapVisible, setChekOutMapVisible] = useState(false);
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      scroll="paper"
      maxWidth="md"
      fullWidth
      disableScrollLock
    >
      <DialogTitle className="flex justify-between items-center">
        <span className="text-lg font-medium">Customize Gift Packaging</span>
        <IconButton onClick={() => setIsOpen(false)} size="small">
          <IoMdClose />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers className="!p-4 sm:!p-6">
        <Carousel
          autoPlaySpeed={3000}
          infinite={true}
          arrows
          draggable
          responsive={{
            desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
            tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
            mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
          }}
          showDots={false}
          slidesToSlide={1}
          swipeable
          autoPlay={false}
        >
          {gift?.map((item) => (
            <div key={item.id} className="px-2 relative">
              <label className="flex flex-col gap-2 cursor-pointer">
                <div className="relative border border-gray-100 shadow h-[166px] w-full rounded overflow-hidden">
                  <Image
                    src={imageLink}
                    alt={item?.name}
                    fill
                    quality={80}
                    className="object-cover"
                  />
                </div>

                <div className="absolute bottom-2 z-10 left-2 right-3 flex justify-between items-center mt-2 px-1">
                  <p className="text-sm bg-white px-2 py-1 rounded shadow text-gray-700 mx-2">
                    {item?.name} | {item?.amount}
                  </p>
                  <Radio
                    checked={values.gift_id === item.id}
                    onChange={() => setFieldValue("gift_id", item.id)}
                    value={item.id}
                    name="gift_id"
                    color="error"
                    className="w-4 h-4 "
                  />
                </div>
              </label>
            </div>
          ))}
        </Carousel>

        {/* Address Options */}
        <div className="flex w-full gap-2 mb-4 overflow-x-auto whitespace-nowrap mt-4">
          {[
            { id: 1, label: "Send to My Address" },
            { id: 3, label: "Send to Receiver Address" },
            { id: 2, label: "Ask the Receiver for the Address" },
          ]?.map((option) => (
            <button
              key={option?.id}
              onClick={() => handleOptionChange(option?.id)}
              className={`px-4 py-2 text-xs rounded-sm border cursor-pointer ${
                selectedOption === option?.id
                  ? "bg-[#bb1f2a] text-white border-[#bb1f2a]"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              {option?.label}
            </button>
          ))}
        </div>

        {/* Gift Form */}
        <GiftForm
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          selectedCountry={selectedCountry}
          handleClickOpen={handleClickOpen}
          setIsGiftSaved={setIsGiftSaved}
          setIsOpen={setIsOpen}
          selectedOption={selectedOption}
          cities={cities}
          areas={areas}
          getCity={getCity}
          validateForm={validateForm}
          handlePriview={handlePriview}
          setChekOutMapVisible={setChekOutMapVisible}
        />
      </DialogContent>
      <ChekOutMap
        dailog={chekOutMapVisible}
        handleCloseDailog={() => setChekOutMapVisible(false)}
        onPlaceChanged={locationSelected}
        address={values?.address}
        setAddress={setFieldValue}
        currentLocation={currentLocation}
        handleDragEnd={handleDragEnd}
      />
    </Dialog>
  );
};

export default GiftDialog;
