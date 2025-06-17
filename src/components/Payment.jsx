import Script from "next/script";

export default function Payment() {
    const openRazorpay = () => {
        const options = {
            key: "rzp_test_1DP5mmOlF5G5ag",
            amount: 5000000,
            currency: "INR",
            name: "Ram",
            description: "Test Transaction",
            image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
            handler: function (response) {
                alert("Payment successful!");
                console.log("Payment ID:", response.razorpay_payment_id);
            },
            prefill: {
                name: "Customer Name",
                email: "customer@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <>
            {/* Razorpay script */}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />

            <div className="p-4">
                <h1 className="text-xl font-bold mb-4">Razorpay</h1>
                <button onClick={openRazorpay} className="bg-blue-600 text-white px-4 cursor-pointer py-2 rounded">
                    Pay ₹50000
                </button>
            </div>
        </>
    );
}
