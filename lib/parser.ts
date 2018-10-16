/**
 * Figure Builder by William Hart
 * Provided under the MIT license, 2018
 *
 * This file provides the CLI entry point. It parses the JSON files and
 * generates figure panels accordingly.
 */

import * as fs from 'fs'
import { promisify } from 'util'

import * as Chalk from 'chalk'

import Figure from './figure'
import { IPanel, IDefinition } from './types';

const fsr = promisify(fs.readFile)

class Parser {
  public OnReady : Promise<any>
  schema : Figure[]
  metadata?: IDefinition

  constructor(path: string, ch: Chalk.Chalk) {
    this.schema = []

    this.OnReady = new Promise(async (res, rej) => {
      const contents = await fsr(path, 'utf8')
      this.metadata = JSON.parse(contents)
      if (!this.metadata) {
        console.log(ch.red("Unable to parse input file!"))
        return rej()
      }

      this.schema = this.metadata.data.map((d: IPanel): Figure => new Figure(d))
      return res(true)
    })
  }

  async run(ch: Chalk.Chalk, runAsync: boolean) {
    if (!this.metadata) {
      console.log(ch.red("Unable to generate figures - no metadata defined"))
      return
    }

    if (runAsync) {
      console.log('Running build asynchronously. This may cause font issues on Windows.')
      this.schema.forEach(async (fig: Figure) => {
        await fig.generate()
      })
    } else {
      for (const fig of this.schema) {
        console.log(`### Processing ${fig.metadata.output}`)
        await fig.generate()
      }
    }
  }
}

export default Parser
