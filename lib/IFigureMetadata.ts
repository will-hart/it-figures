interface ISubFigure {
  source: string,
  top: number,
  left: number,
  rowspan: number,
  colspan: number
}

interface IFigureMetadata {
  output: string
  width: number,
  height: number,
  sizex: number,
  sizey: number,
  images: ISubFigure[]
}

interface IExportSchema {
  data: IFigureMetadata[]
}

export {
  IExportSchema,
  IFigureMetadata,
  ISubFigure
}
