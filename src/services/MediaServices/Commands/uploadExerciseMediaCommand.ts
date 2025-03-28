import { storage } from '../../../config/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

interface UploadMediaResponse {
    success: boolean;
    data?: {
        animationUrl?: string;
        videoUrl?: string;
        thumbnailUrl?: string;
    };
    errorMessage?: string;
}

export class UploadExerciseMediaCommand {
    async execute(files: {
        animation?: Buffer;
        video?: Buffer;
        thumbnail?: Buffer;
    }): Promise<UploadMediaResponse> {
        try {
            const urls: { 
                animationUrl?: string;
                videoUrl?: string;
                thumbnailUrl?: string;
            } = {};

            // Animasyon yükleme
            if (files.animation) {
                const animationRef = ref(storage, `exercises/animations/${uuidv4()}.gif`);
                await uploadBytes(animationRef, files.animation);
                urls.animationUrl = await getDownloadURL(animationRef);
            }

            // Video yükleme
            if (files.video) {
                const videoRef = ref(storage, `exercises/videos/${uuidv4()}.mp4`);
                await uploadBytes(videoRef, files.video);
                urls.videoUrl = await getDownloadURL(videoRef);
            }

            // Thumbnail yükleme
            if (files.thumbnail) {
                const thumbnailRef = ref(storage, `exercises/thumbnails/${uuidv4()}.jpg`);
                await uploadBytes(thumbnailRef, files.thumbnail);
                urls.thumbnailUrl = await getDownloadURL(thumbnailRef);
            }

            return {
                success: true,
                data: urls
            };

        } catch (error) {
            console.error('Error uploading exercise media:', error);
            return {
                success: false,
                errorMessage: 'Failed to upload exercise media'
            };
        }
    }
}
