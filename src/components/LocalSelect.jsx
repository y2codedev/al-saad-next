"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { routing, usePathname, useRouter } from "../i18n/navigation";
import { useParams } from "next/navigation";

export default function LocalSelect({ defaultValue }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const handleChange = (value) => {
    router.replace({ pathname, params }, { locale: value });
  };

  return (
    <Select defaultValue={defaultValue} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {routing?.locales?.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {lang.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
