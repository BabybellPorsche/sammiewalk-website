import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useRouteDetail } from '../hooks/useRouteDetail';
import { typography } from '../lib/styleguide';

import RouteCard from '../components/ui/RouteCard';
import ImageLightbox from '../components/ui/ImageLightbox';

import RouteHero from '../components/route-detail/RouteHero';
import RouteSidebar from '../components/route-detail/RouteSidebar';
import RouteContent from '../components/route-detail/RouteContent';
import RouteGallery from '../components/route-detail/RouteGallery';

export default function RouteDetail() {
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        route,
        loading,
        error,
        geoJsonData,
        mapCenter,
        mapBounds,
        similarRoutes,
        handleDelete,
        handleShare
    } = useRouteDetail(id);

    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

    const allImages = route ? [
        ...(route.cover_photo_url ? [route.cover_photo_url] : []),
        ...(route.gallery_urls || [])
    ] : [];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeImageIndex === null) return;
            if (e.key === 'ArrowRight') setActiveImageIndex((prev) => prev !== null ? (prev + 1) % allImages.length : null);
            if (e.key === 'ArrowLeft') setActiveImageIndex((prev) => prev !== null ? (prev - 1 + allImages.length) % allImages.length : null);
            if (e.key === 'Escape') setActiveImageIndex(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeImageIndex, allImages.length]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
        );
    }

    if (error || !route) {
        return (
            <div className="max-w-6xl mx-auto py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Route niet gevonden</h2>
                <Link to="/" className="text-primary hover:underline">Terug naar Overzicht</Link>
            </div>
        );
    }

    return (
        <div className="w-full pb-12">
            <title>{route.title} | SammieWalk</title>

            <RouteHero
                route={route}
                user={user}
                onDelete={() => handleDelete(() => navigate('/'))}
            />

            {/* Split Content Container */}
            <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16 items-start">

                    {/* Main Content (Left, 2/3) */}
                    <div className="lg:col-span-2 space-y-12">
                        <RouteContent route={route} />
                        <RouteGallery
                            galleryUrls={route.gallery_urls || []}
                            onImageClick={setActiveImageIndex}
                            coverPhotoExists={!!route.cover_photo_url}
                        />
                    </div>

                    {/* Sidebar (Right, 1/3, Sticky) */}
                    <RouteSidebar
                        route={route}
                        geoJsonData={geoJsonData}
                        mapCenter={mapCenter}
                        mapBounds={mapBounds}
                        onShare={handleShare}
                    />

                </div>
            </div>

            {/* Similar Routes Section */}
            {similarRoutes.length > 0 && (
                <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full mt-2 md:mt-8 pt-8 border-t border-border/10">
                    <h2 className={`${typography.h2} mb-6`}>Vergelijkbare Routes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {similarRoutes.map(similar => (
                            <div key={similar.id} className="h-full">
                                <RouteCard route={similar} onClick={() => window.scrollTo(0, 0)} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lightbox Modal */}
            <ImageLightbox
                images={allImages}
                activeIndex={activeImageIndex}
                onChange={setActiveImageIndex}
            />
        </div>
    );
}
