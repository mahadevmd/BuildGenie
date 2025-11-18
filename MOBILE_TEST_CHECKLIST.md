# Mobile App Testing Checklist

## 🌐 Browser Testing (Available Now)
**Access**: http://localhost:3000

### Responsive Design Tests:
- [ ] Desktop view (>768px)
- [ ] Tablet view (768px - 1024px)
- [ ] Mobile view (<768px)
- [ ] Ultra-mobile view (<480px)

### Mobile UX Tests:
- [ ] Navigation menu works on mobile
- [ ] Buttons have proper touch targets (44px minimum)
- [ ] Forms are keyboard-friendly (16px font size)
- [ ] Scrolling is smooth on mobile
- [ ] Images load properly on mobile
- [ ] Text is readable on small screens

## 📱 Device-Specific Tests

### Android Features (when tested on device):
- [ ] Back button navigation works
- [ ] Status bar integration
- [ ] Safe area handling (notched devices)
- [ ] Touch feedback/haptics

### iOS Features (when tested on device):
- [ ] Swipe navigation works
- [ ] Status bar integration
- [ ] Safe area handling (iPhone X+)
- [ ] Safari compatibility

## 🔧 Functionality Tests
Test all core BuildGenie features on mobile:

### Authentication:
- [ ] Login page works on mobile
- [ ] Registration page works on mobile
- [ ] Form validation works
- [ ] Password fields show/hide work

### PC Builder:
- [ ] Component selection on mobile
- [ ] Build configuration interface
- [ ] Compatibility checking
- [ ] Price calculations

### Build Management:
- [ ] Save builds functionality
- [ ] Load saved builds
- [ ] Delete builds
- [ ] Build sharing

### Pre-built Configurations:
- [ ] Budget PC page
- [ ] Office PC page
- [ ] Workstation page
- [ ] Gaming PC page

### AI Features:
- [ ] Performance predictions
- [ ] Game recommendations
- [ ] AI service integration

## 🚀 Performance Tests
### On mobile devices/network:
- [ ] App loads within 3 seconds
- [ ] Images are optimized
- [ ] API calls complete quickly
- [ ] Memory usage is reasonable

### Network conditions:
- [ ] Works on 4G/LTE
- [ ] Works on slower connections
- [ ] Handles offline gracefully
- [ ] Shows loading states properly

## 🎯 Quick Test Workflow

1. **Desktop Browser**: http://localhost:3000
2. **Chrome DevTools Device Mode**: Test responsive design
3. **Real Phone Browser**: http://YOUR_IP:3000
4. **Functional Testing**: Go through all features
5. **Performance Testing**: Check load times and responsiveness

## 📋 Test Results Template

```
Testing Environment: [Desktop/Mobile/iOS/Android]
Browser: [Chrome/Safari/etc]
Screen Size: [320x568/375x667/etc]
Network: [WiFi/4G/3G]

✅ Working Features:
❌ Issues Found:
📝 Notes:
```

## 🔗 Useful Tools

### Device Simulation:
- Chrome DevTools Device Mode
- Firefox Responsive Design Mode
- Safari Develop → Enter Responsive Design Mode

### Network Simulation:
- Chrome DevTools Network throttling
- iOS Simulator network conditions
- Android emulator network settings

### Performance Testing:
- Lighthouse audit (Chrome DevTools)
- WebPageTest.org
- GTmetrix mobile testing