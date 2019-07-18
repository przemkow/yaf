import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  plugins: [
    typescript({
      "declaration": true,
    })
  ],
  output: {
    name: 'Yaf',
    file: 'dist/yaf.js',
    format: 'cjs'
  },
}; 
