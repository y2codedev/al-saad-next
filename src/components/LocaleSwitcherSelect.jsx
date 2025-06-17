"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { FormControl, Select } from "@mui/material";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function LocaleSwitcherSelect({ children, defaultValue }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setLanguage } = useLanguageStore();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(defaultValue);
  const searchParams = useSearchParams();
  function onSelectChange(event) {
    const nextLocale = event.target.value;
    setLanguage(nextLocale);
    setValue(nextLocale);
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace({ pathname: fullPath, params }, { locale: nextLocale });
  }

  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{
        backgroundColor: "transparent",
        "& .MuiOutlinedInput-root": {
          fontSize: 14,
          color: "#333",
          background: "transparent",
          "& fieldset": { border: "none" },
        },
      }}
    >
      <Select
        MenuProps={{ disableScrollLock: true }}
        defaultValue={defaultValue}
        value={value}
        onChange={onSelectChange}
        disabled={isPending}
        displayEmpty
        inputProps={{
          sx: {
            padding: "8px 12px",
          },
        }}
      >
        {children}
      </Select>
    </FormControl>
  );
}
