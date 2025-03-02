# Carousel Images

This directory contains images used in the main carousel on the homepage.

## Image Guidelines

- Recommended image size: 1920x1080px (16:9 ratio)
- Format: JPG or PNG
- File size: Optimize images to be under 500KB each
- Name format: carousel-1.jpg, carousel-2.jpg, etc.

## Current Setup

The carousel is configured to display three images. To update the carousel:

1. Add your images to this directory
2. Use the following naming convention:
   - carousel-1.jpg
   - carousel-2.jpg
   - carousel-3.jpg

## Usage in index.ejs

The carousel images are referenced in the index.ejs file as:

```html
<img src="/images/carousel-images/carousel-1.jpg" alt="Esports Event 1">
<img src="/images/carousel-images/carousel-2.jpg" alt="Esports Event 2">
<img src="/images/carousel-images/carousel-3.jpg" alt="Esports Event 3">
```

To change the images, simply replace the files in this directory while maintaining the same filenames.