const CURRENCY_FORMATTER = new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND', 
    minimumFractionDigits: 0, // No decimal places for VND
    maximumFractionDigits: 0  // No decimal places for VND
});

export const formatCurrency = (number) => {
    return CURRENCY_FORMATTER.format(number);
};
