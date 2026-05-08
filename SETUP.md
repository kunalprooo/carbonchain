# 🚀 CarbonChain Setup Guide

## ⚡ Quick Start (5 minutes)

### Step 1: Install Expo CLI
```bash
npm install -g expo-cli
```

### Step 2: Clone the Repo
```bash
git clone https://github.com/kunalprooo/carbonchain.git
cd carbonchain
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start the App
```bash
npm start
```

### Step 5: Run on Device/Simulator
- **iOS:** Press `i` (requires Mac with Xcode)
- **Android:** Press `a` (requires Android Studio)
- **Web:** Press `w` (instant in browser)

---

## 🛠️ System Requirements

- **Node.js:** v16 or higher
- **npm:** v7 or higher
- **Expo Account:** Free at https://expo.dev/signup

### For iOS Development
- Mac with Xcode 13+
- iOS Simulator

### For Android Development
- Android Studio
- Android SDK

### For Web (Easiest for Testing)
- Just a browser!

---

## 📲 Testing the App

### Option 1: Web Browser (Easiest) ✅
```bash
npm start
# Press 'w'
# Opens in localhost:19006
```
**No setup needed!** Perfect for hackathon demos.

### Option 2: Expo Go App
1. Download "Expo Go" from App Store or Play Store
2. Run `npm start`
3. Scan the QR code with your phone
4. App opens instantly on your phone

### Option 3: iOS Simulator
```bash
npm start
# Press 'i'
# Opens iOS simulator
```

### Option 4: Android Emulator
```bash
npm start
# Press 'a'
# Opens Android emulator
```

---

## 📊 Demo Data

The app comes preloaded with example functionality:

1. **Home Screen:** Enter company name (e.g., "Nike")
2. **Add Suppliers:** Try adding:
   - Samsung: 10,000 kg
   - TSMC: 8,500 kg
   - Foxconn: 12,000 kg
3. **View Dashboard:** See automated calculations and charts

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process
lsof -ti:19000 | xargs kill -9
npm start
```

### Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Expo Not Found
```bash
npm install -g expo-cli@latest
expo --version
```

### iOS Simulator Not Found
```bash
# Open Xcode and select your simulator
open -a Simulator
```

---

## 📤 Deploying for Hackathon

### Build APK (Android)
```bash
eas build --platform android
```

### Build IPA (iOS)
```bash
eas build --platform ios
```

### Deploy Web Version
```bash
npm run web
# Share the localhost URL or deploy to Vercel
```

---

## 🎯 Hackathon Checklist

- ✅ App runs locally (`npm start`)
- ✅ Can add suppliers and view dashboard
- ✅ Data persists during session
- ✅ Beautiful UI with green theme
- ✅ Real calculations for CO2 tracking
- ✅ Works on mobile (via Expo Go) or web

---

## 📝 File Structure

```
carbonchain/
├── App.tsx              # Main application logic
├── app.json             # Expo configuration
├── package.json         # Dependencies
├── README.md            # Project documentation
├── SETUP.md             # This file
├── PITCH.md             # Hackathon pitch deck
└── neo4j-setup.md       # Database setup (optional)
```

---

## 🔗 Useful Links

- **Expo Docs:** https://docs.expo.dev/
- **React Native API:** https://reactnative.dev/docs/
- **Hackathon Rules:** Check event website
- **Deployment:** https://expo.dev/accounts/kunalprooo

---

## 💡 Pro Tips for Hackathon Success

1. **Test on Web First** - Fastest feedback loop
2. **Screenshot Everything** - Good for demo slides
3. **Use Real Data** - Makes it more impressive
4. **Have a Pitch Ready** - "This solves ESG for companies"
5. **Deploy Early** - Share a working link with judges

---

## 🚀 You're Ready!

Run this command and start building:
```bash
npm start
```

Good luck with the hackathon! 🎉
