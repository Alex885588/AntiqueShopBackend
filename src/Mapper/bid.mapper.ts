import { Bid } from "src/Models/bid";
import { BidDto } from "src/DTO/bid.DTO";

export class BidMapper {
    toDto(bid: Bid): BidDto {
        const bidDto: BidDto = new BidDto();
        bidDto.id = bid.id;
        bidDto.user_id = bid.user_id;
        bidDto.antiques_id = bid.antiques_id;
        bidDto.bidAmount = bid.bidAmount;
        bidDto.bidStatus = bid.bidStatus;
        return bidDto;
    }

    toEntity(bidDto: BidDto): Bid {
        const bid: Bid = new Bid();
        bid.id = bidDto.id
        bid.user_id = bidDto.user_id;
        bid.antiques_id = bidDto.antiques_id;
        bid.bidAmount = bidDto.bidAmount;
        bid.bidStatus = bidDto.bidStatus
        return bid;
    }
}
