"use client";
import { useEffect } from "react";
import { useRouter } from "navigation";
import { redirect } from "next/navigation";

export default function StokRedirect() {
  redirect("/produk");
  return null;
}
