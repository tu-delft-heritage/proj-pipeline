# PROJ Pipeline to convert Bonne XY coordinates to WGS84

This pipepine is used to convert Bonne XY coordinates of map sheet corners to WGS84.

It is based on the student report [Georeferencing Historic Map Series: An Automated Approach](http://resolver.tudelft.nl/uuid:a39e2c3e-640c-4fa5-8abf-1e376d75ae5f) and the transformation parameters offered by Jochem Lesparre (Kadaster). Input files were made using the Observable Notebook [Sheet indices Dutch map series](https://observablehq.com/@tudelft/sheet-indices).

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

Requires PROJ's [cct](https://proj.org/en/9.3/apps/cct.html) command to be available from the shell. See the [installation instructions](https://proj.org/en/9.3/install.html).

## Input and output

Add input files to the `input/` folder; you will be prompted which file to convert after running the script. Input files have the `.json` extension and use the following format:

```js
[
    [
        1, // Number or string identifying the sheet
        [
            // Array of four Bonne XY coordinates (in meters)
            [80000, 237500],
            [90000, 237500],
            [90000, 231250],
            [80000, 231250]
        ]
    ]
]
```

The output is a GeoJSON Feature Collection containing Multipoint features in the `output/` folder. Existing files are overwritten.

```json
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "sheet": 1
            },
            "geometry": {
                "type": "MultiPoint",
                "coordinates": [
                    [6.0928972337, 53.628014761],
                    [6.2440274063, 53.6264371447],
                    [6.2422224774, 53.5702885829],
                    [6.0912924804, 53.5718641828]
                ]
            }
        }
    ]
}
```

## Todo

- Support different output formats (e.g. Polygon, Multipoint)
- Support GeoJSON input with Bonne coordinates
- Use typescript
- Better error handling

---

This project was created using `bun init` in bun v1.0.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
