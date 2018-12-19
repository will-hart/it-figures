/**
 * Figure Builder by William Hart
 * Provided under the MIT license, 2018
 *
 * This file provides the CLI entry point. It parses the JSON files and
 * generates figure panels accordingly.
 */

import * as sharp from 'sharp'

import { IPanel } from "../types";

class DefaultGenerator {
  panel: IPanel

  constructor (metadata: IPanel) {
    this.panel = metadata
  }

  generate = async (silent: boolean) => {
    return await this.generateBlankCanvas(
      this.panel.width * this.panel.sizex,
      this.panel.height * this.panel.sizey,
    )
      .then(sh => this.applySubFigures(sh, silent))
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
  applySubFigures = async (sh: sharp.SharpInstance, silent: boolean) => {
    let newSh = sh

    for (const image of this.panel.images) {
      const offx = parseInt((image.offsetx || 0).toString())
      const offy = parseInt((image.offsety || 0).toString())
      const top = image.top * this.panel.sizey
      const left = image.left * this.panel.sizex
      const w = image.cols * this.panel.sizex
      const h = image.rows * this.panel.sizey
      if (!silent) console.log(` --> Default Generator: ${image.source} at {${top}, ${left}} with dimensions ${w} x ${h}`)

      const blank = await this.generateBlankCanvas(w + offx, h + offy)

      const subfig = await sharp(image.source)
        .resize(w, h)
        .max()
        .background({r: 0, g: 0, b: 0, alpha: 0})
        .embed()
        .toBuffer()

      let imgBuffer = await blank.overlayWith(subfig, { top: offy, left: offx }).toBuffer()

      if (image.caption) {
        imgBuffer = await this.addCaption(
          imgBuffer,
          image.caption,
          this.panel.fontSize || 32,
          this.panel.fontFamily || 'Open Sans'
        )
      }

      const buff = await newSh.overlayWith(imgBuffer, {
        top: top,
        left: left
      }).toBuffer()

      newSh = await sharp(buff)
    }

    return newSh
  }

  addCaption = async (buf: Buffer, caption: string, fontSize: number, font: string) => {
    const captBuffer = new Buffer(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <style>.c { font-family: "${font}" }</style>
      <text class="c" x="0" y="0" dy="${fontSize}" font-size="${fontSize}" fill="#000">${caption}</text>
    </svg>`)

    return await sharp(buf).overlayWith(captBuffer, { top: 0, left: 0 }).toBuffer()
  }

  /**
   * Writes the generated figure panel out to file
   * @param sh The SharpInstance being written
   */
  writeOutput = async (sh: sharp.SharpInstance) => {
    return await sh.toFile(this.panel.output)
      .then(() => true)
      .catch((err: any) => console.log(err))
  }
}

export default DefaultGenerator
