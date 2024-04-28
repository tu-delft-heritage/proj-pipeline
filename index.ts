// https://bun.sh/docs/runtime/shell
import { $ } from "bun"
import { Glob } from "bun";
import { createSelection } from 'bun-promptx'
import turf from "turf"

// Listing files in input folder
const glob = new Glob("input/*.json");

const files = new Array()

for await (const file of glob.scan(".")) {
    files.push({ text: file.split("/")[1] })
}

// Prompt user for file
const result = createSelection(files, {
    headerText: 'Select file to convert: ',
    perPage: 10
})

// Input file
const filename = files[result.selectedIndex].text
const input = await Bun.file("./input/" + filename).json()

// Flat list of coords, for PROJ input
const coord = input.map(i => i[1]).flat().map(coord => coord[0] + " " + coord[1]).join("\n")

// Transform coords with cct command
const response = await $`echo ${coord} | cct -z 0 +proj=pipeline +step +proj=bonne +lat_1=51.5 +lon_0=0 +a=6376950.4 +rf=309.65 +pm=4.883882778 +inv +step +proj=cart +a=6376950.4 +rf=309.65 +step +proj=helmert +convention=coordinate_frame +exact +x=932.9862 +y=86.2986 +z=-197.9356 +rx=2.276813 +ry=1.478043 +rz=4.673555 +s=50.09450 +step +proj=noop +step +proj=cart +ellps=WGS84 +inv`.quiet()

// Output to json
const jsonResp = response.text().split("\n").filter(i => i).map(coord => {
    const matches = coord.match(/  ([\d.]+)   ([\d.]+)/)
    return [+matches[1], +matches[2]]
})

// Group coords again
const arr = new Array()
for (let i = 0; i < jsonResp.length; i += 4) {
    const sheet = jsonResp.slice(i, i + 4);
    arr.push(sheet)
}

// Create GeoJSON collection
const features = arr.map((sheet, index) => turf.multiPoint(sheet, { sheet: input[index][0] }))
const featureCollection = turf.featureCollection(features)

// Write output file
await Bun.write(`./output/${filename.replace("json", "geojson")}`, JSON.stringify(featureCollection, null, 4));

console.log("File " + filename.replace("json", "geojson") + " succesfully written to output folder.")

// Optional output to terminal using jq
// await $`echo ${JSON.stringify(featureCollection)} | jq '.'`