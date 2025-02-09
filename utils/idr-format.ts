export const idrFormat = (price: number): string => {
  // Convert to billions if applicable
  if (price >= 1000000000) {
    const billions = price / 1000000000;
    return `Rp ${billions.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })} Milyar`;
  }

  // Convert to millions
  if (price >= 1000000) {
    const millions = price / 1000000;
    return `Rp ${millions.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })} Juta`;
  }

  // Format regular numbers
  return `Rp ${price.toLocaleString("id-ID")}`;
};
