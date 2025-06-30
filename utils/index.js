import AsyncStorage from "@react-native-async-storage/async-storage";

export const getItem = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value === null) return null;

        return JSON.parse(value);
    } catch (error) {
        console.error('❌ Error get item:', error);
        return [];
    }
};

export const setItem = async (key, values) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(values));
    } catch (error) {
        console.error('❌ Error set item:', error);
    }
};

export const clearItem = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('❌ Error clear item:', error);
    }
};

export const addFavorite = async (player) => {
    try {
        const favorites = await getItem('favorites');
        const newFavorites = Array.isArray(favorites) ? [...favorites] : [];

        const exists = newFavorites.some((p) => p.id === player.id);
        if (!exists) {
            newFavorites.push(player);
            await setItem('favorites', newFavorites);
        }
    } catch (error) {
        console.error('❌ Error adding favorite:', error);
    }
};

export const removeFavorite = async (playerId) => {
    try {
        const favorites = await getItem('favorites');
        if (!Array.isArray(favorites)) return;

        const updatedFavorites = favorites.filter((p) => p.id !== playerId);
        await setItem('favorites', updatedFavorites);
    } catch (error) {
        console.error('❌ Error removing favorite:', error);
    }
};

