module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo', 'nativewind/babel'],

    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],

          alias: {
            '@': './',
            '@/src': './src',
            '@/stores': './src/stores',
            '@/api': './src/api',
            '@/components': './src/components',
          },
        },
      ],
    ],
  };
};
