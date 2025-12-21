"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
let UploadsService = class UploadsService {
    s3Client;
    bucketName = process.env.AWS_BUCKET_NAME;
    constructor() {
        this.s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
    }
    async uploadFile(file) {
        if (!process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID === 'AKIA...') {
            console.warn('AWS Credentials missing. Returning real placeholder for testing.');
            return {
                url: `https://picsum.photos/seed/${Date.now()}/512`,
                key: `mock-${Date.now()}.png`
            };
        }
        try {
            const key = `${Date.now()}-${file.originalname}`;
            const upload = new lib_storage_1.Upload({
                client: this.s3Client,
                params: {
                    Bucket: this.bucketName,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: 'public-read',
                },
            });
            await upload.done();
            return {
                url: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
                key: key,
            };
        }
        catch (e) {
            console.error('S3 Upload Error', e);
            throw new Error('File upload failed');
        }
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map