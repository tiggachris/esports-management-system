# Carousel Images

This directory is where you should place your carousel images for the homepage.

## Image Guidelines

1. Place your carousel images directly in this directory (not in subfolders)
2. Recommended image specifications:
   - Resolution: 1920x1080px (16:9 aspect ratio)
   - Format: JPG or PNG
   - File size: Optimize images to be under 500KB each
   - Names: Use descriptive names (e.g., 'tournament-finals.jpg', 'team-celebration.jpg')

## Current Carousel Setup

The carousel is configured to display three images. To add your images:

1. Place your image files in this directory
2. Update the image sources in '/views/index.ejs'
3. Replace the placeholder paths:
   - placeholder1.jpg
   - placeholder2.jpg
   - placeholder3.jpg

Example:
```html
<img src="/images/your-image-name.jpg" alt="Your Image Description">
```

## Existing Folders
- teams/ - Contains team-specific images (not for carousel use)