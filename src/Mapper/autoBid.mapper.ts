import { AutoBid } from "src/Models/autoBid";
import { AutoBidDto } from "src/DTO/autoBid.DTO";

export class AutoBidMapper {
    toDto(autoBid: AutoBid): AutoBidDto {
        const autoBidDto: AutoBidDto = new AutoBidDto();
        autoBidDto.id = autoBid.id;
        autoBidDto.user_id = autoBid.user_id;
        autoBidDto.antiques_id = autoBid.antiques_id;
        autoBidDto.maximumBidAmount = autoBid.maximumBidAmount;
        autoBidDto.isActive = autoBid.isActive;
        return autoBidDto;
    }

    toEntity(autoBidDto: AutoBidDto): AutoBid {
        const autoBid: AutoBid = new AutoBid();
        autoBid.id = autoBidDto.id;
        autoBid.user_id = autoBidDto.user_id;
        autoBid.antiques_id = autoBidDto.antiques_id;
        autoBid.maximumBidAmount = autoBidDto.maximumBidAmount;
        autoBid.isActive = autoBidDto.isActive
        return autoBid;
    }
}
