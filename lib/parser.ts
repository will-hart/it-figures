/**
 * Figure Builder by William Hart
 * Provided under the MIT license, 2018
 *
 * This file provides the CLI entry point. It parses the JSON files and
 * generates figure panels accordingly.
 */

import * as fs from 'fs'
import { promisify } from 'util'

import Figure from './figure'
import { IPanel, IDefinition } from './types';

const fsr = promisify(fs.readFile)

class Parser {
  public OnReady : Promise<any>
  schema : Figure[]
  metadata?: IDefinition
  silent: boolean

  constructor(path: string, silent: boolean) {
    this.schema = []
    this.silent = silent

    this.OnReady = new Promise(async (res) => {
      const contents = await fsr(path, 'utf8')
      this.metadata = JSON.parse(contents)
      if (!this.metadata) {
        throw new Error("Unable to parse input file!")
      }

      this.schema = this.metadata.data.map((d: IPanel): Figure => new Figure(d))
      return res(true)
    })
  }

  async run(runAsync: boolean) {
    if (!this.metadata) {
      throw new Error("Unable to generate figures - no metadata defined")
    }

    if (runAsync) {
      if (!this.silent) console.log('Running build asynchronously. This may cause font issues on Windows.')
      this.schema.forEach(async (fig: Figure) => {
        await fig.generate()
      })
    } else {
      for (const fig of this.schema) {
        if (!this.silent) console.log(`### Processing ${fig.metadata.output}`)
        await fig.generate()
      }
    }
  }
}

export default Parser
