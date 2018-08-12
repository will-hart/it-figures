/**
 * Figure Builder by William Hart
 * Provided under the MIT license, 2018
 *
 * This file provides the CLI entry point. It parses the JSON files and
 * generates figure panels accordingly.
 */

import * as fs from 'fs'
import { promisify } from 'util'

import { Chalk } from 'chalk'
import * as ora from 'ora'

import Figure from './figure'
import { IFigureMetadata, IExportSchema } from './IFigureMetadata';

const fsr = promisify(fs.readFile)

class Parser {
  public OnReady : Promise<any>
  schema : Figure[]
  metadata?: IExportSchema

  constructor(path: string, ch: Chalk) {
    this.schema = []

    this.OnReady = new Promise(async (res, rej) => {
      const spinner = ora(`Reading JSON file from ${path}`).start()

      const contents = await fsr(path, 'utf8')
      this.metadata = JSON.parse(contents)

      spinner.text = 'Validating schema'
      // TODO

      spinner.text = 'Preparing for export'
      if (!this.metadata) {
        spinner.stop()
        console.log(ch.red("Unable to parse input file!"))
        return rej()
      }

      this.schema = this.metadata.data.map((d: any): Figure => new Figure(d))

      spinner.stop()
      return res(true)
    })
  }

  async run(ch: Chalk) {
    if (!this.metadata) {
      console.log(ch.red("Unable to generate figures - no metadata defined"))
      return
    }

    this.schema.forEach(async (fig: Figure) => {
      await fig.generate()
    })
  }
}

export default Parser
