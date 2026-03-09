# Personal Portfolio & Blog

A modern, fast, and beautiful personal website built with [Astro](https://astro.build/).

## 🚀 Features

- ✨ **Personal Portfolio** - Showcase your work and skills
- 📝 **Blog** - Share your knowledge with Markdown/MDX support
- 📄 **CV/Resume Page** - Display your professional experience
- 📬 **Contact Page** - Multiple ways to connect
- 🎨 **Beautiful Design** - Clean, modern, and responsive
- ⚡ **Fast Performance** - Built with Astro for optimal speed
- 🔍 **SEO Friendly** - Meta tags, sitemap, and RSS feed included

## 🧞 Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 📝 Customization

### 1. Update Personal Information

Edit `src/consts.ts` to update your personal information:

```typescript
export const SITE_TITLE = 'Your Name - Portfolio & Blog';
export const SITE_DESCRIPTION = 'Your description';
export const SITE_AUTHOR = 'Your Name';
export const SITE_EMAIL = 'your.email@example.com';

export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  twitter: 'https://twitter.com/yourusername',
  email: 'your.email@example.com'
};
```

### 2. Write Blog Posts

Create new blog posts in `src/content/blog/`. Use Markdown or MDX format:

```markdown
---
title: 'My First Blog Post'
description: 'This is my first post!'
pubDate: 'Feb 28 2026'
heroImage: '/blog-placeholder.jpg'
---

Your content here...
```

### 3. Update About, CV, and Contact Pages

Edit the respective files in `src/pages/` to customize your content.

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy! Your site will be live at `your-project.vercel.app`

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository on [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

### Deploy to GitHub Pages

1. Update `astro.config.mjs` with your site URL
2. Push to GitHub
3. Enable GitHub Pages in repository settings

## 📂 Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   ├── content/         # Blog posts (Markdown/MDX)
│   ├── layouts/         # Page layouts
│   ├── pages/           # Page routes
│   │   ├── index.astro  # Home page
│   │   ├── about.astro  # About page
│   │   ├── cv.astro     # CV/Resume page
│   │   ├── contact.astro # Contact page
│   │   └── blog/        # Blog pages
│   ├── styles/          # Global styles
│   └── consts.ts        # Site configuration
└── astro.config.mjs     # Astro configuration
```

## 🎨 Customization Tips

- Update colors in `src/styles/global.css`
- Add your photo to `public/` and update `about.astro`
- Customize navigation in `src/components/Header.astro`
- Update footer in `src/components/Footer.astro`

## 📄 License

MIT License - Feel free to use this template for your own portfolio!

npm run dev -- --port 4333
