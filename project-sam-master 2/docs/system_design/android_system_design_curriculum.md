# Android System Design Curriculum

**Purpose:** Comprehensive Android system design preparation for Google interviews. Mobile-first, not backend infrastructure.

---

## **Week 1: Android Architecture Fundamentals**

### **Day 1: Clean Architecture & MVVM**
**Topics:**
- Clean Architecture principles (UI → Domain → Data layers)
- MVVM pattern implementation
- Repository pattern
- Dependency injection (Hilt/Dagger)

**Resources:**
- [Android Architecture Components](https://developer.android.com/topic/architecture)
- [MVVM with Android Architecture Components](https://developer.android.com/jetpack/guide)
- [Clean Architecture for Android](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

**Practice:**
- Design a simple TODO app with MVVM
- Implement Repository pattern for data access

### **Day 2: Data Persistence & Caching**
**Topics:**
- Room database design
- SharedPreferences vs DataStore
- Caching strategies (memory, disk, network)
- Offline-first architecture

**Resources:**
- [Room Database](https://developer.android.com/training/data-storage/room)
- [DataStore](https://developer.android.com/topic/libraries/architecture/datastore)
- [Android Caching Strategies](https://developer.android.com/topic/performance/graphics/cache-bitmap)

**Practice:**
- Design database schema for a news app
- Implement offline-first data flow

### **Day 3: Networking & API Design**
**Topics:**
- Retrofit implementation
- API response handling
- Error handling strategies
- Network state management

**Resources:**
- [Retrofit Documentation](https://square.github.io/retrofit/)
- [Android Network Security](https://developer.android.com/training/articles/security-config)
- [Handling API Errors](https://developer.android.com/topic/architecture/ui-layer/errors)

**Practice:**
- Design API layer for a social media app
- Implement error handling and retry logic

### **Day 4: UI/UX Patterns & Performance**
**Topics:**
- RecyclerView optimization
- Custom views and animations
- Memory leak prevention
- ANR prevention

**Resources:**
- [RecyclerView Performance](https://developer.android.com/guide/topics/ui/lists/recyclerview-performance)
- [Custom Views](https://developer.android.com/guide/topics/ui/custom-components)
- [Memory Leaks in Android](https://developer.android.com/topic/performance/memory)

**Practice:**
- Design a custom RecyclerView with efficient scrolling
- Implement smooth animations without memory leaks

### **Day 5: Week 1 Review & Mock Design**
**Review Topics:**
- Architecture patterns comparison
- Data flow design
- Performance optimization techniques

**Mock Design Problem:**
"Design a photo gallery app with offline support"

---

## **Week 2: Advanced Android Patterns**

### **Day 6: App Modularization**
**Topics:**
- Feature modules
- Dynamic feature delivery
- Module dependencies
- Build optimization

**Resources:**
- [App Modularization](https://developer.android.com/topic/modularization)
- [Dynamic Feature Modules](https://developer.android.com/guide/app-bundle/dynamic-delivery)
- [Gradle Module Dependencies](https://developer.android.com/studio/build/dependencies)

**Practice:**
- Break down a large app into feature modules
- Design module dependency graph

### **Day 7: Background Processing & Services**
**Topics:**
- WorkManager for background tasks
- Foreground services
- Job scheduling
- Battery optimization

**Resources:**
- [WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager)
- [Background Processing](https://developer.android.com/guide/background)
- [Battery Optimization](https://developer.android.com/topic/performance/power)

**Practice:**
- Design background sync system for a messaging app
- Implement battery-efficient background processing

### **Day 8: Security & Privacy**
**Topics:**
- Data encryption
- Secure storage
- Network security
- Privacy compliance (GDPR, CCPA)

**Resources:**
- [Android Security](https://developer.android.com/topic/security)
- [Encrypted SharedPreferences](https://developer.android.com/reference/androidx/security/crypto/EncryptedSharedPreferences)
- [Network Security Config](https://developer.android.com/training/articles/security-config)

**Practice:**
- Design secure authentication flow
- Implement encrypted local storage

### **Day 9: Testing & Quality Assurance**
**Topics:**
- Unit testing (JUnit, Mockito)
- UI testing (Espresso)
- Integration testing
- Test-driven development

**Resources:**
- [Android Testing](https://developer.android.com/training/testing)
- [Espresso UI Testing](https://developer.android.com/training/testing/espresso)
- [Test Architecture](https://developer.android.com/topic/architecture/testing)

**Practice:**
- Design comprehensive test suite for a feature
- Implement TDD workflow

### **Day 10: Week 2 Review & Mock Design**
**Review Topics:**
- Modularization strategies
- Security implementation
- Testing approaches

**Mock Design Problem:**
"Design a secure banking app with biometric authentication"

---

## **Week 3: Real-World Android Applications**

### **Day 11: Social Media App Design**
**Topics:**
- Real-time updates
- Feed optimization
- Media handling
- Social features

**Practice Problem:**
"Design Instagram-like app"
- Focus: Feed performance, image caching, real-time updates
- Components: Feed, Stories, Direct Messages, Profile

### **Day 12: E-commerce App Design**
**Topics:**
- Product catalog
- Shopping cart
- Payment integration
- Order management

**Practice Problem:**
"Design Amazon-like shopping app"
- Focus: Product search, cart management, payment flow
- Components: Catalog, Cart, Checkout, Order tracking

### **Day 13: Messaging App Design**
**Topics:**
- Real-time messaging
- Media sharing
- Group chats
- Push notifications

**Practice Problem:**
"Design WhatsApp-like messaging app"
- Focus: Real-time communication, media sharing, encryption
- Components: Chats, Groups, Media, Settings

### **Day 14: News/Content App Design**
**Topics:**
- Content delivery
- Personalization
- Offline reading
- Content discovery

**Practice Problem:**
"Design Medium-like content app"
- Focus: Content caching, personalization, offline reading
- Components: Feed, Article reader, Bookmarks, Search

### **Day 15: Week 3 Review & Mock Design**
**Review Topics:**
- Common patterns across different app types
- Performance optimization strategies
- User experience considerations

**Mock Design Problem:**
"Design a ride-sharing app like Uber"

---

## **Week 4: Advanced Topics & Interview Prep**

### **Day 16: Performance Optimization**
**Topics:**
- Memory optimization
- CPU optimization
- Battery optimization
- Network optimization

**Resources:**
- [Android Performance](https://developer.android.com/topic/performance)
- [Memory Profiling](https://developer.android.com/studio/profile/memory-profiler)
- [Battery Profiling](https://developer.android.com/studio/profile/battery-profiler)

### **Day 17: Accessibility & Internationalization**
**Topics:**
- Accessibility features
- Multi-language support
- RTL layouts
- Screen reader support

**Resources:**
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)
- [Localization](https://developer.android.com/guide/topics/resources/localization)

### **Day 18: App Store Optimization**
**Topics:**
- App bundle optimization
- Play Store listing
- A/B testing
- Analytics integration

**Resources:**
- [App Bundle](https://developer.android.com/guide/app-bundle)
- [Play Console](https://play.google.com/console)

### **Day 19: Emerging Technologies**
**Topics:**
- Jetpack Compose
- Kotlin Multiplatform
- Android Automotive
- Wear OS

**Resources:**
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
- [Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform.html)

### **Day 20: Final Review & Mock Interview**
**Complete Mock Interview:**
- 45-minute system design session
- Android-specific problem
- Architecture discussion
- Trade-offs analysis

---

## **Daily Practice Structure:**

### **Morning (60 minutes):**
1. **Study Topic** (30 minutes)
2. **Practice Problem** (30 minutes)

### **Evening (30 minutes):**
1. **Review Previous Day** (15 minutes)
2. **Quick Notes** (15 minutes)

### **Weekly (Day 5, 10, 15, 20):**
1. **Mock Design Session** (45 minutes)
2. **Feedback & Improvement** (15 minutes)

---

## **Success Metrics:**
- **Daily:** Complete topic study + practice problem
- **Weekly:** Successfully complete mock design session
- **Monthly:** Can design any Android app architecture confidently

**Remember:** Focus on Android-specific concerns, not backend infrastructure.
