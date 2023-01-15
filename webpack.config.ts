import 'webpack-dev-server';
import { Configuration } from 'webpack';
import DotenvWebpackPlugin from 'dotenv-webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default (env: { [k: string]: string | boolean }): Configuration => {
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
