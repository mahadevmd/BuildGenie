# BuildGenie Mobile App Testing Guide

## Option 1: Web Browser Testing (Immediate)
- **URL**: http://localhost:3000 (already running!)
- **Features**: Test all web functionality, responsive design
- **Mobile Simulation**: Use Chrome DevTools Device Mode

### How to Test Mobile Features in Browser:
1. Open Chrome DevTools (F12)
2. Click device icon (Toggle Device Toolbar)
3. Select iPhone 12, Galaxy S20, or other mobile devices
4. Test touch interactions, responsive layouts

## Option 2: Android Testing (Local Setup Required)

### Prerequisites:
```bash
# Install Android Studio
# Or just install Android command line tools
```

### Testing Methods:

#### A. Android Emulator (Recommended)
```bash
# 1. Set up Android emulator in Android Studio
# 2. Start emulator
# 3. Run your app
npx cap run android
```

#### B. Physical Android Device
```bash
# 1. Enable Developer Options on Android device
# Settings > About Phone > Tap Build Number 7 times
# 2. Enable USB Debugging
# 3. Connect device via USB
# 4. Run app
npx cap run android
```

#### C. Android APK Build (Shareable)
```bash
# Build debug APK for testing
cd android
./gradlew assembleDebug

# APK location: android/app/build/outputs/apk/debug/app-debug.apk
# Share this file with testers
```

## Option 3: iOS Testing (macOS Required)

### Prerequisites:
- macOS computer
- Xcode (free from App Store)
- iOS Simulator or physical iOS device

### Testing Methods:

#### A. iOS Simulator (Recommended)
```bash
# 1. Install Xcode
# 2. Open in Xcode
npx cap open ios
# 3. Select target simulator (iPhone 14, etc.)
# 4. Run (Cmd+R)
```

#### B. Physical iOS Device
```bash
# 1. Connect iPhone/iPad to Mac
# 2. Trust developer certificate on device
# 3. Select device in Xcode
# 4. Run
```

#### C. iOS Build (Shareable)
```bash
# Build for testing via Xcode
# Create .ipa file for distribution
```

## Option 4: Docker Production Testing

### Test Full Production Stack:
```bash
# Build and run all services
npm run prod

# Test web app at http://localhost
# Test API endpoints at http://localhost/api
```

## Testing Checklist

### Web Features:
- [ ] User registration/login
- [ ] PC builder functionality
- [ ] Component selection
- [ ] Saved builds management
- [ ] Pre-built configurations
- [ ] AI performance predictions
- [ ] Responsive design on different screen sizes

### Mobile-Specific Features:
- [ ] Safe area handling (notched devices)
- [ ] Touch targets (44px minimum)
- [ ] Mobile scrolling behavior
- [ ] Status bar integration
- [ ] Splash screen display
- [ ] Back button navigation (Android)

### Cross-Platform:
- [ ] Data sync between web and mobile
- [ ] Consistent authentication
- [ ] API integration works correctly
- [ ] Error handling on mobile

## Automated Testing

### Mobile UI Testing:
```bash
# Install testing dependencies
npm install --save-dev @testing-library/jest-dom @testing-library/react-native-web

# Run mobile-specific tests
npm test -- --testPathPattern=mobile
```

### Performance Testing:
```bash
# Test bundle size
npm run build

# Analyze bundle
npx webpack-bundle-analyzer build/static/js/*.js
```

## Quick Start Testing

1. **Browser Testing**: http://localhost:3000 (ready now!)
2. **Mobile Browser**: Test on phone browser
3. **Responsive Testing**: Chrome DevTools device mode
4. **Advanced Testing**: Follow setup steps above

## Shareable Testing

### APK for Android Testers:
```bash
# Build shareable APK
npm run mobile:build-android
# File: android/app/build/outputs/apk/release/app-release.apk
```

### QR Code for Easy Access:
- Share localhost URL for web testing
- Use ngrok for external access: `npx ngrok http 3000`