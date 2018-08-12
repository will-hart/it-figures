/**
 * Figure Builder by William Hart
 * Provided under the MIT license, 2018
 *
 * This file provides the CLI entry point. It parses the JSON files and
 * generates figure panels accordingly.
 */

import * as sharp from 'sharp'
import { IFigureMetadata } from './IFigureMetadata'

class Figure {
  metadata: IFigureMetadata

  /**
   * Default constructor, prepares the figure panel for generation
   * @param metadata The figure metadata
   */
  constructor (metadata: IFigureMetadata) {
    this.metadata = metadata
  }

  /**
   * Generates a figure panel from the supplied metadata
   */
  generate = async () => {
    return await this.generateBlankCanvas()
      .then(this.applySubFigures)
      .then(this.writeOutput)
      .catch(err => console.log(err))
  }

  /**
   * Generates an empty canvas of the specified figure size
   */
  generateBlankCanvas = async () => {
    // start by creating an empty input buffer in the size of the image
    return await sharp(undefined, {
      create: {
        width: this.metadata.width * this.metadata.sizex,
        height: this.metadata.height * this.metadata.sizey,
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
      const top = image.top * this.metadata.sizey
      const left = image.left * this.metadata.sizex
      const w = image.colspan * this.metadata.sizex
      const h = image.rowspan * this.metadata.sizey
      console.log(`Overlaying image ${image.source} at {${top}, ${left}} with dimensions ${w} x ${h}`)

      const ol = await sharp(image.source)
        .resize(w, h)
        .background({r: 0, g: 0, b: 0, alpha: 0})
        .embed()
        .toBuffer()

      const buff = await newSh.overlayWith(ol, {
        top,
        left
      }).toBuffer()

      newSh = await sharp(buff)
    }

    return newSh
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
