"use client";

const OrderSummaryCard = ({
  orderNumber,
  totalCredit,
  subTotal,
  discountAmount,
  discountCode,
  discountPercent,
  shippingCharge,
  totalPrice,
  title = "Order Summary",
  currency,
}) => {
  return (
    <div className="col-span-12 mt-2 overflow-hidden">
      <div className="mt-5 lg:mt-0">
        <div className="border shadow rounded-sm border-[#dee2e6]">
          {/* Header */}
          <div className="border-b bg-white py-3 px-4 border-[#dee2e6]">
            <h4 className="text-lg  mb-0 text-[#696969] font-medium">
              {title}
              {orderNumber && (
                <span className="float-right font-normal">{orderNumber}</span>
              )}
            </h4>
          </div>

          {/* Body */}
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm">
                <tbody className="text-[16px] ">
                  {totalCredit && (
                    <tr className="bg-gray-100 rounded-sm">
                      <th className="text-left font-medium p-2">
                        Total Credit
                      </th>
                      <td className="text-right font-bold p-2">{`${totalPrice} ${totalCredit}`}</td>
                    </tr>
                  )}

                  {subTotal && (
                    <tr>
                      <td className="p-2">Sub Total :</td>
                      <td className="text-right p-2">{`${subTotal} ${currency}`}</td>
                    </tr>
                  )}

                  {discountAmount && (
                    <tr>
                      <td className="p-2">
                        Discount
                        {discountPercent ? ` (${discountPercent}%)` : ""} :
                        {discountCode && (
                          <div className="text-green-600">{discountCode}</div>
                        )}
                      </td>
                      <td className="text-right text-red-600 py-2">
                        -{`${discountAmount} ${currency}`}
                      </td>
                    </tr>
                  )}

                  {shippingCharge && (
                    <tr>
                      <td className="p-2">Shipping Charge :</td>
                      <td className="text-right p-2">{`${shippingCharge} ${currency}`}</td>
                    </tr>
                  )}

                  {totalPrice && (
                    <>
                      <tr>
                        <td colSpan="2" className="h-4"></td>
                      </tr>{" "}
                      {/* Spacer row */}
                      <tr className="bg-gray-100 rounded-md">
                        <th className="text-left font-bold p-2">
                          Total Price :
                        </th>
                        <td className="text-right font-bold p-2">{`${totalPrice} ${currency}`}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
