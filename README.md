# Room Designer Prototype (Next.js + Three.js)

Frontend-only prototype for a furniture room-design visualiser:
- Dummy login
- 2D top-down layout (drag items)
- 3D preview (Three.js via React Three Fiber)
- Save / edit / delete designs (localStorage)

## Run
1) Install dependencies
```bash
npm install
```

2) Start dev server
```bash
npm run dev
```

Open http://localhost:3000

## Notes
- This is a prototype for coursework: no backend, designs persist only in your browser (localStorage).
- 3D view uses simple box geometry as furniture placeholders.
