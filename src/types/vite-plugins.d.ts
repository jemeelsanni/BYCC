import { Plugin } from 'vite';

interface ReactPluginOptions {
  include?: string | RegExp | (string | RegExp)[];
  exclude?: string | RegExp | (string | RegExp)[];
  jsxRuntime?: 'classic' | 'automatic';
  jsxImportSource?: string;
  babel?: Record<string, unknown>;
  inject?: boolean | {
    react?: string;
    reactDom?: string;
    reactDomClient?: string;
  };
  hot?: boolean;
  fastRefresh?: boolean;
}

declare module '@vitejs/plugin-react' {
  const plugin: (options?: ReactPluginOptions) => Plugin;
  export default plugin;
}