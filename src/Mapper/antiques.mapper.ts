import { Injectable } from '@nestjs/common';
import { Antiques } from 'src/Models/antiques';
import { AntiquesDTO } from 'src/DTO/antiques.DTO';

@Injectable()
export class AntiquesMapper {
    entityToDTO(antiques: Antiques): AntiquesDTO {
        let { id, name, description, currentBid, biddingTimeLimit, biddingInProgress, antiquesImg } = antiques;
        let antiquesImgURL: string | undefined;
        if (antiquesImg) {
            const path = JSON.parse(antiquesImg);
            antiquesImgURL = path.iconURL;
        } else {
            antiquesImgURL = undefined;
        }
        const dto: AntiquesDTO = {
            id,
            name,
            description,
            currentBid,
            biddingTimeLimit,
            biddingInProgress,
            antiquesImg: antiquesImgURL
        };
        return dto;
    }

    DTOToEntity(antiquesDTO: AntiquesDTO): Antiques {
        const antiques = new Antiques();
        antiques.id = antiquesDTO.id;
        antiques.name = antiquesDTO.name;
        antiques.description = antiquesDTO.description;
        antiques.currentBid = antiquesDTO.currentBid;
        antiques.biddingTimeLimit = antiquesDTO.biddingTimeLimit;
        antiques.biddingInProgress = antiquesDTO.biddingInProgress;
        antiques.antiquesImg = antiquesDTO.antiquesImg;
        return antiques;
    }
}
