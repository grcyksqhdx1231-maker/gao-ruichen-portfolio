# Portfolio Site Shell

This is the first website shell for the portfolio. It intentionally contains no real project entries yet.

## Preview

```bash
node server.mjs
```

Open `http://127.0.0.1:4173`.

## Edit Content

- Profile, focus tags, contact links, categories: `data/projects.js`
- Project records: `projects` array in `data/projects.js`
- Visual system: `styles/main.css`
- Interaction logic: `scripts/app.js`

## Project Record Shape

```js
{
  id: "project-id",
  number: "01",
  title: "Project Title",
  year: "2026",
  category: "ai-tools",
  description: "One-line project summary.",
  thumbnail: "./assets/project-cover.jpg",
  tags: ["AI", "Interaction"]
}
```

Available category IDs:

- `ai-tools`
- `data-viz`
- `experimental`
- `hardware`
- `visual`
