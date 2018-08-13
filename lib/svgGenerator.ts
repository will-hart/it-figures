// import * as window from 'svgdom'
// import * as SVG from 'svg.js'
// SVG(window)
const window   = require('svgdom')
const SVG      = require('svg.js')(window)
const document = window.document

import { Nested, Doc } from 'svg.js'

import * as fs from 'fs'
import { promisify } from 'util'

import { IPanel, ISubFigure } from './types';

const fsw = promisify(fs.writeFile)

class SvgGenerator {
  panel: IPanel
  document: any

  constructor (panel: IPanel) {
    this.panel = panel
    this.document = window.document
  }

  generate = async () => {
    const canvas = this.generateCanvas(
      this.panel.sizex * this.panel.width,
      this.panel.sizey * this.panel.height
    )

    if (this.panel.images.length === 0) {
      console.log("No images in panel, aborting")
      return
    }

    this.panel.images.forEach((image: ISubFigure) => {
      console.log(` --> SVG Generator - ${image.source}`)

      // create a group and throw the imported svg into it
      const svg = fs.readFileSync(image.source, 'utf8');
      const g = canvas.nested().svg(svg)

      const scale = this.getScale(g, image)
      g.scale(scale, scale)
        .move(
          image.left * this.panel.sizex + (image.offsetx || 0),
          image.top * this.panel.sizey + (image.offsety || 0)
        )

      // if we don't have a caption, exit
      if (!image.caption) return

      const fontSize = this.panel.fontSize || 32

      // add the caption to the group
      g.text(image.caption)
        .fill('#000000')
        .move(0, fontSize) // add font size due to the x/y position being bottom left of text
        .font({
          size: fontSize,
          family: (this.panel.fontFamily || 'Helvetica'),
          anchor: 'start'
        })
    })

    // write the svg string to file
    await fsw(this.panel.output, canvas.svg())
  }

  /**
   * Gets the scale to use for an image, maintaining aspect ratio and fitting
   * within the given bounds
   */
  getScale = (g: Nested, image: ISubFigure): number => {
    // current w/h of group
    const { width, height } = g.bbox()

    // size of sub figure grid area we are fitting the image to
    const boxW = this.panel.sizex * image.cols
    const boxH = this.panel.sizey * image.rows

    // determine the correct scaling value - basically scale to the smallest available proportion
    return Math.min(width / boxW, height / boxH)
  }

  /**
   * Generates a new SVG canvas that represents the entire size of the panel
   */
  generateCanvas = (width: number, height: number): Doc => {
    return SVG(this.document.documentElement).size(width, height)
  }
}

export default SvgGenerator
