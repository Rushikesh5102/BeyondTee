export declare class UploadsService {
    private s3Client;
    private bucketName;
    constructor();
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
        key: string;
    }>;
}
