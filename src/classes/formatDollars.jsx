

export default function formatDollars(amount) {
    const amountDiv = amount/1000000
    if (Math.abs(amountDiv) < 1) {
        return '$' + (amountDiv*1000).toFixed(0).toString() + 'k'
    } else if (Math.abs(amountDiv) < 1000) {
        return '$' + amountDiv.toFixed(1).toString() + 'm'
    } else {
        return '$' + amountDiv.toFixed(0).toString() + 'm'
    }
}