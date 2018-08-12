interface ISubFigure {
  source: string
  top: number
  left: number
  rowspan: number
  colspan: number
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
  images: ISubFigure[]
}

interface IDefinition {
  data: IPanel[]
}

export {
  IDefinition,
  IPanel,
  ISubFigure
}
