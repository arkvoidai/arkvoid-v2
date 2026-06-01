import fs from 'fs';
const content = fs.readFileSync('apps/web/components/marketing/hero.tsx', 'utf8');

const oldText = `  const particles = Array.from({ length: 20 }).map((_, i) => {
    const size = Math.floor(Math.random() * 3) + 1;
    const top = \`\${Math.random() * 100}%\`;
    const left = \`\${Math.random() * 100}%\`;
    const colors = ['#CCFF00', '#cdcbd6', '#4ADE80'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const opacity = (Math.random() * 0.25) + 0.1;
    const duration = (Math.random() * 25) + 15;
    const delay = Math.random() * 15;

    return { id: i, size, top, left, color, opacity, duration, delay };
  });`;

const newText = `  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }).map((_, i) => {
        const size = Math.floor(Math.random() * 3) + 1;
        const top = \`\${Math.random() * 100}%\`;
        const left = \`\${Math.random() * 100}%\`;
        const colors = ['#CCFF00', '#cdcbd6', '#4ADE80'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const opacity = (Math.random() * 0.25) + 0.1;
        const duration = (Math.random() * 25) + 15;
        const delay = Math.random() * 15;

        return { id: i, size, top, left, color, opacity, duration, delay };
      })
    );
  }, []);`;

fs.writeFileSync('apps/web/components/marketing/hero.tsx', content.replace(oldText, newText));
