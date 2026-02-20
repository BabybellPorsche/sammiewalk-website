import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'sammiewalk_favorites';

export function useFavorites() {
    // Initialize state from localStorage or an empty array
    const [favorites, setFavorites] = useState<string[]>(() => {
        try {
            const item = window.localStorage.getItem(FAVORITES_KEY);
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error('Error reading favorites from localStorage:', error);
            return [];
        }
    });

    // Save to localStorage whenever favorites changes
    useEffect(() => {
        try {
            window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        } catch (error) {
            console.error('Error saving favorites to localStorage:', error);
        }
    }, [favorites]);

    const toggleFavorite = (routeId: string) => {
        setFavorites((prevFavorites) => {
            if (prevFavorites.includes(routeId)) {
                return prevFavorites.filter((id) => id !== routeId);
            } else {
                return [...prevFavorites, routeId];
            }
        });
    };

    const isFavorite = (routeId: string) => {
        return favorites.includes(routeId);
    };

    return {
        favorites,
        toggleFavorite,
        isFavorite,
    };
}
