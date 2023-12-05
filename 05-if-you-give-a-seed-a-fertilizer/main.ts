const input = await Bun.file('input.txt').text()

const [rawSeeds, ...rawMaps] = input.split('\n\n')

const seeds = rawSeeds.split(': ').at(-1)?.split(' ').map(Number) || []

const maps = rawMaps.map(parseMap)

seeds.forEach((seed) => {})

function parseMap(rawMap: string): Map<number, number> {
	const [_, ...rawEntries] = rawMap.split('\n')
	const map = new Map<number, number>()
	rawEntries
		.map((rawEntry) => rawEntry.split(' '))
		.forEach((rawEntry) => {
			const [destRangeStart, sourceRangeStart, rangeLength] =
				rawEntry.map(Number)
			Array.from({ length: rangeLength }).forEach((_, index) => {
				map.set(sourceRangeStart + index, destRangeStart + index)
			})
		})
	return map
}
