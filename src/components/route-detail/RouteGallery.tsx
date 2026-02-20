import { Image as ImageIcon } from 'lucide-react';
import { typography, borderRadius } from '../../lib/styleguide';
import { FadeIn } from '../ui/FadeIn';

interface RouteGalleryProps {
    galleryUrls: string[];
    onImageClick: (index: number) => void;
    coverPhotoExists: boolean;
}

export default function RouteGallery({ galleryUrls, onImageClick, coverPhotoExists }: RouteGalleryProps) {
    if (!galleryUrls || galleryUrls.length === 0) return null;

    return (
        <FadeIn>
            <h2 className={`${typography.h2} mb-6 flex items-center gap-3`}>
                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <ImageIcon className="w-4 h-4" />
                </span>
                Foto's
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryUrls.map((url, i) => (
                    <div
                        key={i}
                        className={`aspect-square ${borderRadius.container} overflow-hidden border border-border/10 relative group cursor-pointer`}
                        onClick={() => onImageClick(coverPhotoExists ? i + 1 : i)}
                    >
                        <img src={url} alt={`Gallery image ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                ))}
            </div>
        </FadeIn>
    );
}
