import { Injectable } from "@nestjs/common";
import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AWService {
    private s3 = new S3({
        region: process.env.AWSAWS_S3_REGIONREGION,
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY
    });

    constructor() { }

    async uploadIcon(
        file: Express.Multer.File
    ): Promise<{ iconPath: string; iconURL: string }> {
        const position = uuidv4();
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `public/${position}.png`,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read"
        };
        const { Location } = await this.s3.upload(params).promise();
        return {
            iconPath: params.Key,
            iconURL: Location
        };
    }
}
