import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect } from 'react';

interface ImageLightboxProps {
    images: string[];
    activeIndex: number | null;
    onChange: (index: number | null) => void;
}

export default function ImageLightbox({ images, activeIndex, onChange }: ImageLightboxProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeIndex === null) return;

            if (e.key === 'Escape') onChange(null);
            if (e.key === 'ArrowLeft' && images.length > 1) {
                onChange((activeIndex - 1 + images.length) % images.length);
            }
            if (e.key === 'ArrowRight' && images.length > 1) {
                onChange((activeIndex + 1) % images.length);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, images.length, onChange]);

    if (activeIndex === null || !images[activeIndex]) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-12 animate-in fade-in duration-200"
            onClick={() => onChange(null)}
        >
            <button
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-50"
                onClick={(e) => { e.stopPropagation(); onChange(null); }}
            >
                <X className="w-6 h-6" />
            </button>

            {images.length > 1 && (
                <>
                    <button
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-50 hidden md:flex"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange((activeIndex - 1 + images.length) % images.length);
                        }}
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-50 hidden md:flex"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange((activeIndex + 1) % images.length);
                        }}
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </>
            )}

            <motion.img
                key={activeIndex}
                src={images[activeIndex]}
                alt="Enlarged view"
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl touch-none select-none"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(_, { offset }) => {
                    const swipeThreshold = 50;
                    if (offset.x > swipeThreshold) {
                        onChange((activeIndex - 1 + images.length) % images.length);
                    } else if (offset.x < -swipeThreshold) {
                        onChange((activeIndex + 1) % images.length);
                    }
                }}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}
