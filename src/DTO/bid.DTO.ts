import { BidStatus } from "src/Enums/bid.status";

export class BidDto {
    id?: number
    user_id?: number;
    antiques_id?: number;
    bidAmount?: number;
    bidStatus?: BidStatus
}
