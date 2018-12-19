/**
 * Figure Builder by William Hart
 * Provided under the MIT license, 2018
 *
 * This file provides the CLI entry point. It parses the JSON files and
 * generates figure panels accordingly.
 */

import { IPanel, ParserMode } from './types'
import { DefaultGenerator, SvgGenerator } from './generators'

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
  generate = async (root: string, silent: boolean) => {
    if (!this.metadata.mode || this.metadata.mode === ParserMode.Default)
    {
      if (!silent) console.log('Generating panel in default mode')
      return new DefaultGenerator(this.metadata).generate(root, silent)
    }

    if (!silent) console.log(`Generating panel in ${this.metadata.mode} mode`)
    if (this.metadata.mode === ParserMode.Svg) {
      return new SvgGenerator(this.metadata).generate(root, silent)
    } else {
      throw new Error(`Unknown generation mode: ${this.metadata.mode}. No export will be created.`)
    }
  }
}

export default Figure
