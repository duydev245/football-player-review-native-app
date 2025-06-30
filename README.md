# 🏆 Football Player Review Showcase App

A mobile application built with **React Native** (Expo) that allows users to browse football players, view detailed stats, and manage a list of their favorite players with added AI analysis, image selection, and map features.

---

## 🚀 Features

### ✅ Core Features
- 📋 **Player List**: View all players fetched from [MockAPI](https://mockapi.io/).
- 🔍 **Search Players**: Real-time search on Home and Favorites screens.
- 💖 **Favorites**: Add/remove players from local storage (AsyncStorage).
- 📄 **Detail Screen**: Rich details, stats, and user feedback for each player.
- 📊 **Feedback Filtering**: Filter reviews based on rating.
- 🗑️ **Edit Mode** in Favorites:
  - Long press to enable selection mode.
  - Select one or multiple players to remove.
  - Swipe to delete individual items.

### 🧠 Advanced Features
- 🧬 **Gemini AI Integration**: Analyze a player's performance (basic AI simulation).
- 🗺️ **Map Integration**: Displays player-related locations using `react-native-maps`.
- 🖼️ **Image Picker**: Pick avatar/profile picture from device using `expo-image-picker`.

---

## 🖼️ Screens

- **🏠 Home**: Browse players, filter by team.
- **📄 Detail**: In-depth info, favorite toggle, review filter.
- **⭐ Favorites**: Manage your selected players with advanced edit capabilities.
- **⚙️ Settings**: Access image picker and map demo features.

---

## 🛠️ Tech Stack

- **React Native (Expo)**
- **React Navigation**
- **AsyncStorage**
- **MockAPI** (for data)
- **FlatList, ScrollView, Pressable, Image, Icons**
- **React Native Maps**
- **Expo Image Picker**
- *(Simulated)* Gemini AI Analysis

---

## 📂 Project Structure

📁 components/ # Reusable UI like PlayerCard, FeedbackCard

📁 screens/ # HomeScreen, DetailScreen, FavoritesScreen, SettingsScreen

📁 utils/ # Helpers (AsyncStorage handlers)

📄 App.js # Root file with navigation

---

## 🚦 How to Run

```bash
git clone <repo-url>
cd <project-folder>
npm install
npx expo start
