import { useEffect, useState } from "react";
import MobileVerify from "@/components/MobileVerify";
import useUserStore from "@/store/user";

const MobileVerificationPopup = () => {
  const { userInfo } = useUserStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userInfo) return;
    const isMobileVerified = userInfo?.is_mobile_verified == 1;
    const hasSkippedVerification = sessionStorage.getItem(
      "mobile_verification_skipped",
    );
    if (!isMobileVerified && !hasSkippedVerification) {
      setTimeout(() => {
        setOpen(true);
      }, 500);
    }
  }, [userInfo]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSkip = () => {
    sessionStorage.setItem("mobile_verification_skipped", "true");
    setOpen(false);
  };

  return <MobileVerify open={open} onClose={handleClose} onSkip={handleSkip} />;
};

export default MobileVerificationPopup;
