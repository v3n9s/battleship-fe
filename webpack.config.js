// @ts-check
import 'webpack-dev-server';
import DotenvWebpackPlugin from 'dotenv-webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

/**
 * @param {{ [k: string]: string | boolean }} env
 * @returns {import('webpack').Configuration}
 */
export default (env) => {
  const isDev = env.mode === 'dev';
  const port =
    env.port && !Number.isNaN(+env.port) && +env.port > 0 ? +env.port : 3000;

  return {
    mode: isDev ? 'development' : 'production',
    entry: {
      index: './src/index',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/i,
          use: ['ts-loader'],
        },
      ],
    },
    devServer: {
      port,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '...'],
    },
    devtool: isDev ? 'inline-source-map' : false,
    plugins: [
      new DotenvWebpackPlugin({ safe: true }),
      new ForkTsCheckerWebpackPlugin(),
      new HtmlWebpackPlugin({ template: './src/index.html' }),
    ],
    output: {
      clean: true,
    },
  };
};
