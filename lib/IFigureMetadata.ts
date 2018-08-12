interface ISubFigure {
  source: string,
  grid_top: number,
  grid_left: number,
  grid_rowspan: number,
  grid_colspan: number
}

interface IFigureMetadata {
  output: string
  grid_width: number,
  grid_height: number,
  grid_sizex: number,
  grid_sizey: number,
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
