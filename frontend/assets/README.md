# App Assets

This directory contains the visual assets for the BuildGenie mobile application.

## Icons Directory (`/icons`)

Required files for app icons:
- `icon.png` (1024x1024) - Main app icon
- `icon-foreground.png` (1024x1024) - Foreground layer for adaptive icons (Android)
- `icon-background.png` (1024x1024) - Background layer for adaptive icons (Android)
- `logo.png` (1200x1200) - App logo for splash screen

## Splash Directory (`/splash`)

Required files for splash screens:
- `splash.png` (2732x2732) - Main splash screen image
- `splash-dark.png` (2732x2732) - Dark theme variant
- `splash-logo.png` - Centered logo for splash screen

## Asset Guidelines

1. **File Formats**: Use PNG format with transparency support
2. **Resolution**: Follow the exact pixel dimensions specified
3. **Design**: Ensure assets work well on both light and dark backgrounds
4. **Branding**: Maintain consistent BuildGenie branding across all assets

## Generated Assets

After placing the source assets in these directories, Capacitor will automatically generate:
- iOS icons and splash screens
- Android adaptive icons and splash screens
- Platform-specific asset variations

Note: Placeholder assets should be replaced with final designs before app store submission.