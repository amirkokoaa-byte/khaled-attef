sed -i 's/const interval = setInterval(() => {/const interval = setInterval(() => {/g' src/components/Header.tsx
sed -i 's/}, 60000);/}, 30000);/g' src/components/Header.tsx
