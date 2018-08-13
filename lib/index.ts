#!/usr/bin/env node

/**
 * Figure Builder by William Hart
 * Provided under the MIT license, 2018
 *
 * This file provides the CLI entry point. It parses the JSON files and
 * generates figure panels accordingly.
 */

import * as commander from 'commander'
import * as chalk from 'chalk'

import Parser from './parser';

const version = '0.2.0'
const ch = chalk.default

commander
  .version(version, '-v, --version')
  .description('A CLI for building scientific figure panels from raw files using a JSON definition')

commander
  .command('build <input>')
  .alias('b')
  .description('Builds a figure panel from the given output panel')
  .action((input, opts) => {
    console.log(ch.bgGreen(ch.black(`FIGURE BUILDER CLI ${version}`)))
    const p = new Parser(input, ch)
    p.OnReady.then(async () => {
      await p.run(ch)
        .catch(err => {
          console.log(ch.bgRedBright("Error encountered while generating images!"))
          console.log(err)
        })
    })
  })

commander.parse(process.argv)
