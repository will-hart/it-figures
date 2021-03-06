# It Figures

`figures` is a node based command line utility for building up figure panels out of multiple images
that can be used in publications.

## Installation

It can be installed by:

    npm i -g it-figures

## Why?

A lot of my figures are generated programatically in `jupyter` notebooks. Building up multi-part
figures is a real pain in Word / LaTeX or in Photoshop. This is an attempt to automate the process
with a simple CLI tool that uses `JSON` figure definitions.

## Example

To start with save a `JSON` file, e.g. `figure-a.json`.

    {
      "data": [
        {
          "output": "output.png",
          "width": "16",
          "height": "9",
          "sizex": "100",
          "sizey": "100",
          "images": [
            { "source": "input.svg", "top": "0", "left": "0", "rows": "7", "cols": "9", "caption": "A" },
            { "source": "input.png", "top": "6", "left": "5", "rows": "2", "cols": "3", "offsety": "20" }
          ]
        }
      ]
    }

Then in the same directory run

    figures build figure-a.json

Here two images `input.svg` and `input.png` will be combined and exported to `output.png`. See below for more
details about the data format.

> **NOTE**
> This will build synchronously, which helps reduce some font detection issues in `cairo` on the Windows platform.
> If you are on another platform or don't use captions, the `async` version of this command may run a little faster.
> ```
> figures async figure-a.json
> ```
>

## Documentation

### CLI

`figure` ships as a CLI. Once installed globally, up to date documentation can be viewed by running:

```shell
$ figures --help
```

All of the figure panels defined in the definition file can be built at once by running the `build` command:

```shell
$ figures build my_input_file.json
```

### Definition Files

The basic `JSON` file is a *definition* file, which contains information about the figure panels that are
being generated. Multiple figure panels can be generated at once.

The definition file has only one key, `data` which contains an array of *figure panel definitions*.

### Figure Panel

The definition files contain an array of figure panel objects. Figure Builder uses a grid system to
position the sub figures. Each panel in the definition file can have separate grid dimensions. Images
can then be placed on the grid and are automatically scaled to fit (with aspect ratio preserved).

The figure panel definition object has the following structure:

- **output: string** the file name including extension where the panel should be exported
- **fontSize: Number** (optional, default: 32) the size of font to use for figure captions
- **mode: string** (option, default: 'DEFAULT') allows selecting different parser modes. See *Parser Modes* below for more details
- **width: Number** the width of a single grid item in pixels
- **height: Number** the height of a single grid item in pixels
- **sizex: Number** the number of grids in the x-direction
- **sizey: Number** the number of grids in the y-direction
- **images: ImageDefinition[]** an array of images that should be included in the figure panel

For example, to create a *1000 x 500* pixel image from a *10 x 10* grid, the following could be provided:

```js
{
  // ...
  "width": "100",
  "sizex": "10",
  "height": "50",
  "sizey": "10",
  // ...
}
```

### Image Definition

Each panel can have an array of included images (which are essentially sub figures of the panel). The image
definition object has the following structure:

- **source: string** the path to the input file
- **top: Number** the grid "square" to place the image in, from the top starting at 0
- **left: Number** the grid "square" to place the image in, from the left starting at 0
- **rows: Number** the number of rows in the grid that the image should occupy
- **cols: Number** the number of columns in the grid that the image should occupy
- **caption: string** (optional, default: no caption) the caption to write for this image (i.e. an "A" for figure A)
- **offsetx: number** (optional, default: 0) the amount to move the image by in the x-direction
- **offsety: number** (optional, default: 0) the amount to move the image by in the y-direction

> Note that as aspect ratio is preserved, then the sub figure may not occupy an entire grid square as
> defined by the top/left and rows/cols

### Parser Modes

There are currently two supported modes - `DEFAULT` and `SVG`.

#### `DEFAULT` mode

In this mode, all supported input formats are parsed using `sharp`. Text captions are added by embedding SVG,
with limited font support.

#### `SVG` mode

In SVG mode, all input files must be in SVG format and the output will also be in SVG format
**regardless of the supplied file extension**. The SVG documents will be positioned, moved and exported
in a new SVG document using `svg.js` and `svgdom`. Captions will be added as SVG `text` elements.

## License

MIT. Contributions welcome.
