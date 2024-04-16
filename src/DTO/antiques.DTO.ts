import { bool } from "aws-sdk/clients/signer";

export class AntiquesDTO {
    id?: number;
    name?: string;
    description?: string;
    currentBid?: number;
    biddingTimeLimit?: Date;
    biddingInProgress?: boolean
    antiquesImg?: string;
}
