"use client";

import { redirect } from "next/navigation";

export default function StokRedirect() {
  redirect("/produk");
  return null;
}
