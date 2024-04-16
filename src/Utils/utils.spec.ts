import { bidInParcentage } from "./utils";

describe('bidInParcentage function', () => {
    it('should return true if current price is equal to the specified percentage of max bid amount', () => {
        const currentPrice = 250;
        const parcentage = 50;
        const maxBidAmount = 500;
        const result = bidInParcentage(currentPrice, parcentage, maxBidAmount);
        expect(result).toBe(true);
    });

});
