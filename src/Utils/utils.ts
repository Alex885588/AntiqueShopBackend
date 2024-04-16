export function bidInParcentage(currentPrice: number, parcentage: number, maxBidAmount: number) {
    const currentParcentage = (currentPrice / maxBidAmount) * 100
    if (currentParcentage >= parcentage)
        return true
    return false
}