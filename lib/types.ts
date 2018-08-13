enum ParserMode {
  Default = "DEFAULT",
  Svg = "SVG"
}

interface ISubFigure {
  source: string
  top: number
  left: number
  rows: number
  cols: number
  caption?: string
  offsetx?: number
  offsety?: number
}

interface IPanel {
  output: string
  fontSize?: number
  fontFamily?: string
  width: number
  height: number
  sizex: number
  sizey: number
  mode?: ParserMode
  images: ISubFigure[]
}

interface IDefinition {
  data: IPanel[]
}

export {
  IDefinition,
  IPanel,
  ISubFigure,
  ParserMode
}
