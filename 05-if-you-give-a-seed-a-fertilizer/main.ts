const input = await Bun.file('input.txt').text()

const [rawSeeds, ...rawMaps] = input.split('\n\n')

const seeds = rawSeeds.split(': ').at(-1)?.split(' ').map(Number) || []

const maps = rawMaps.map(parseMap)

const lowestLocation = seeds.reduce((previousValue, value) => {
	const location = maps.reduce((r, map, i) => map(r), value)
	return location < previousValue ? location : previousValue
}, Infinity)

console.log(`Lowest location: ${lowestLocation}`)

function parseMap(rawMap: string): (_: number) => number {
	const [_, ...rawEntries] = rawMap.split('\n')
	const entries = rawEntries.map((rawEntry) => {
		const [destStart, sourceStart, length] = rawEntry.split(' ').map(Number)
		return (previous: number) =>
			previous < sourceStart || previous > sourceStart + length - 1
				? previous
				: destStart + (previous - sourceStart)
	})
	return (value: number) => {
		let result = value
		for (const entry of entries) {
			result = entry(result)
			if (result !== value) {
				break
			}
		}
		return result
	}
}
