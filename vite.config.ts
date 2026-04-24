import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      sourcemap: false,
    },
    plugins: [
      react(),
      // Only obfuscate in production 
      mode === 'production' && obfuscatorPlugin({
        include: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
        apply: 'build',
        options: {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.75,
          deadCodeInjection: false, // Reduced for stability
          debugProtection: false, // Disabled to prevent white screen
          disableConsoleOutput: false, // Enabled to allow debugging
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          numbersToExpressions: true,
          renameGlobals: false,
          selfDefending: false, // Disabled to prevent white screen
          simplify: true,
          splitStrings: true,
          splitStringsChunkLength: 10,
          stringArray: true,
          stringArrayCallsTransform: true,
          stringArrayEncoding: ['base64'], // Changed from rc4 for better compatibility
          stringArrayIndexShift: true,
          stringArrayRotate: true,
          stringArrayShuffle: true,
          stringArrayWrappersCount: 2,
          stringArrayWrappersChainedCalls: true,    
          stringArrayWrappersParametersMaxCount: 2,
          stringArrayWrappersType: 'function',
          stringArrayThreshold: 0.75,
          transformObjectKeys: true,
          unicodeEscapeSequence: false
        }
      })
    ].filter(Boolean),
  };
});
