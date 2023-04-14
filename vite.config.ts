import { fileURLToPath, URL } from 'node:url'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dns from 'dns'
dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      // Specify symbolId format
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: false
      // svgoOptions: {
      //   plugins: [
      //     'cleanupAttrs',
      //     'cleanupEnableBackground',
      //     'cleanupIDs',
      //     'cleanupListOfValues',
      //     'cleanupNumericValues',
      //     'collapseGroups',
      //     'convertPathData',
      //     'convertShapeToPath',
      //     'convertStyleToAttrs',
      //     'convertTransform',
      //     'mergePaths',
      //     'removeComments',
      //     'removeDesc',
      //     'removeDimensions',
      //     'removeDoctype',
      //     'removeEditorsNSData',
      //     'removeEmptyAttrs',
      //     'removeEmptyContainers',
      //     'removeEmptyText',
      //     'removeHiddenElems',
      //     'removeMetadata',
      //     'removeNonInheritableGroupAttrs',
      //     'removeRasterImages',
      //     'removeTitle',
      //     'removeUnknownsAndDefaults',
      //     'removeUselessDefs',
      //     'removeUnusedNS',
      //     'removeUselessStrokeAndFill',
      //     'removeXMLProcInst',
      //     'removeStyleElement',
      //     'removeUnknownsAndDefaults',
      //     'sortAttrs'
      //   ]
      // }
    }),
    AutoImport({
      resolvers: [
        // ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon'
        })
      ],
      imports: ['vue', 'vue-router'],
      eslintrc: {
        enabled: true
      },
      dts: './auto-imports.d.ts'
    }),
    Components({
      resolvers: [
        IconsResolver({
          enabledCollections: ['ep']
        })
        // ElementPlusResolver()
      ]
    }),
    Icons({
      autoInstall: true
    })
  ],
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }]
  },
  server: {
    port: 8080,
    watch: {
      usePolling: true
    }
  }
})
