"use client";

import { useState } from "react";

function formatThousands(value: string) {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function FormattedAmountInput({
  name,
  value = "",
  placeholder,
  className,
}: {
  name: string;
  value?: string;
  placeholder: string;
  className: string;
}) {
  const [amount, setAmount] = useState(() => value.replace(/\D/g, ""));

  return (
    <>
      <input type="hidden" name={name} value={amount} />
      <input
        type="text"
        inputMode="numeric"
        value={formatThousands(amount)}
        onChange={(event) => setAmount(event.target.value.replace(/\D/g, ""))}
        placeholder={placeholder}
        className={className}
      />
    </>
  );
}
