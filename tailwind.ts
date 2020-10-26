/* eslint-disable promise/catch-or-return */
import { writeFileSync } from 'fs';
import path from 'path';

const tailwindcss = require('tailwindcss');

tailwindcss({
  // optional tailwind config
})
  .process(
    `
@tailwind base;
@tailwind components;
@tailwind utilities;

`
  )
  .then((res: Record<string, unknown>) =>
    writeFileSync(path.join(__dirname, 'tailwind.css'), res.css)
  );
