const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, { currency: 'VND', style: 'currency' })

export const formatCurrency = (number) => {
    return CURRENCY_FORMATTER.format(number);
}