import Image from "next/image";
import React from "react";

export default function SearchCard({ image, title, description }) {
  return (
    <div className="flex gap-2 items-center bg-white hover:bg-slate-50 cursor-pointer border border-slate-300 rounded-md p-2 w-[250px]">
      <Image
        src={image}
        alt={title}
        className="rounded"
        width={50}
        height={50}
      />
      <div>
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}
