import { Environment } from 'vitest';

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    console.log('setup executed');

    return {
      async teardown() {
        console.log('teardown executed');
      },
    };
  },
};