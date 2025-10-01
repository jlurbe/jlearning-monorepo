# Animations Added to Japanese Learning App

This document describes all the animations that have been added to enhance the user experience of your Japanese learning application.

## Custom Animations (Tailwind Config)

Added the following custom animations to `tailwind.config.js`:

1. **fade-in**: Smooth opacity transition from 0 to 1
2. **fade-in-up**: Fade in with upward slide motion
3. **slide-down**: Slide down with fade effect
4. **slide-up**: Slide up with fade effect  
5. **scale-in**: Scale from 95% to 100% with fade

## Components with Animations

### 1. Main App (app.tsx)
- **Header**: 
  - Title slides down on page load
  - Subtitle fades in with 0.1s delay
  - Hover effect: title scales up 105%
  
- **Navigation Buttons**:
  - Fade in with 0.2s delay
  - Hover effect: scale up 105%
  
- **Route Content**:
  - Fades in and slides up with 0.3s delay

### 2. Vocabulary Stats (vocabulary-stats.tsx)
- **Stat Cards**:
  - Staggered scale-in animation (0s, 0.1s, 0.2s, 0.3s delays)
  - Hover effect: scale up 105%
  - Smooth shadow transitions

### 3. Vocabulary Table (vocabulary-table.tsx)
- **Empty State**: Fades in
- **Filter Section**: Slides down on load
- **Column Menu**: Fades in when opened
- **New Row Form**: Slides down with animation
- **Table Rows**: 
  - Each row fades in and slides up
  - Staggered delays (0.05s per row)
  - Smooth color transitions on hover
- **Delete Button**: Scales up 110% on hover with smooth transition
- **No Results Message**: Fades in

### 4. Hiragana Page (hiragana.tsx)
- **Card Container**: Fades in and slides up
- **Card Shadow**: Smooth transition on hover
- **Table Rows**: Staggered fade-in-up (0.05s per row)
- **Character Cells**:
  - Hover background color transition
  - Hover scale up 110%
  - Smooth cursor pointer

### 5. Katakana Page (katakana.tsx)
- **Card Container**: Fades in and slides up
- **Card Shadow**: Smooth transition on hover
- **Table Rows**: Staggered fade-in-up (0.05s per row)
- **Character Cells**:
  - Hover background color transition
  - Hover scale up 110%
  - Smooth cursor pointer

### 6. Kanji Page (kanji.tsx)
- **Card Container**: Fades in and slides up
- **Card Shadow**: Smooth transition on hover
- **Empty State**: Fades in
- **Difficulty Sections**: Staggered fade-in-up (0.1s per section)
- **Kanji Badges**:
  - Scale-in animation with delays (0.02s per badge)
  - Hover scale up 110%
  - Smooth transitions
- **Selected Kanji Info**: Slides down when displayed

### 7. Vocabulary Manager (vocabulary-manager.tsx)
- **Loading State**: Book icon with pulse animation (already existed)

## Bug Fixes

- Fixed empty catch block linter error in vocabulary-table.tsx by adding console.debug

## Usage

All animations use CSS animations with Tailwind classes and are hardware-accelerated for smooth performance. The animations:

- Provide visual feedback for user interactions
- Create a polished, professional feel
- Use staggered delays to create flowing entrance animations
- Include hover effects for better interactivity
- Maintain good performance with CSS transforms

## Animation Durations

- Quick animations (fade-in, slide): 0.3-0.5s
- Hover effects: 0.2s
- Scale effects: 0.3s
- Stagger delays: 0.02-0.1s per item

All animations use `ease-out` timing for natural movement.
