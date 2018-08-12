/**
 * Figure Builder by William Hart
 * Provided under the MIT license, 2018
 *
 * This file provides the CLI entry point. It parses the JSON files and
 * generates figure panels accordingly.
 */

import * as sharp from 'sharp'
import { IPanel } from './types'

class Figure {
  metadata: IPanel

  /**
   * Default constructor, prepares the figure panel for generation
   * @param metadata The figure metadata
   */
  constructor (metadata: IPanel) {
    this.metadata = metadata
  }

  /**
   * Generates a figure panel from the supplied metadata
   */
  generate = async () => {
    return await this.generateBlankCanvas(
      this.metadata.width * this.metadata.sizex,
      this.metadata.height * this.metadata.sizey,
    )
      .then(this.applySubFigures)
      .then(this.writeOutput)
      .catch(err => console.log(err))
  }

  /**
   * Generates an empty canvas of the specified figure size
   */
  generateBlankCanvas = async (width: number, height: number) => {
    // start by creating an empty input buffer in the size of the image
    return await sharp(undefined, {
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    }).png()
  }

  /**
   * Generates and applies the given subfigures to the passed image
   * @param sh The SharpInstance being written
   */
  applySubFigures = async (sh: sharp.SharpInstance) => {
    let newSh = sh

    for (const image of this.metadata.images) {
      const offx = parseInt((image.offsetx || 0).toString())
      const offy = parseInt((image.offsety || 0).toString())
      const top = image.top * this.metadata.sizey
      const left = image.left * this.metadata.sizex
      const w = image.colspan * this.metadata.sizex
      const h = image.rowspan * this.metadata.sizey
      console.log(` --> Overlaying image ${image.source} at {${top}, ${left}} with dimensions ${w} x ${h}`)

      const blank = await this.generateBlankCanvas(w + offx, h + offy)

      const subfig = await sharp(image.source)
        .resize(w, h)
        .max()
        .background({r: 0, g: 0, b: 0, alpha: 0})
        .embed()
        .toBuffer()

      let imgBuffer = await blank.overlayWith(subfig, { top: offy, left: offx }).toBuffer()

      if (image.caption) {
        imgBuffer = await this.addCaption(imgBuffer, image.caption, this.metadata.fontSize || 32)
      }

      const buff = await newSh.overlayWith(imgBuffer, {
        top: top,
        left: left
      }).toBuffer()

      newSh = await sharp(buff)
    }

    return newSh
  }

  addCaption = async (buf: Buffer, caption: string, fontSize: number) => {
    const captBuffer = new Buffer(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <text x="0" y="0" dy="${fontSize}" font-size="${fontSize}" fill="#FFF">${caption}</text>
    </svg>`)

    return await sharp(buf).overlayWith(captBuffer, { top: 0, left: 0 }).toBuffer()
  }

  /**
   * Writes the generated figure panel out to file
   * @param sh The SharpInstance being written
   */
  writeOutput = async (sh: sharp.SharpInstance) => {
    return await sh.toFile(this.metadata.output)
      .then(() => true)
      .catch(err => console.log(err))
  }
}

export default Figure
