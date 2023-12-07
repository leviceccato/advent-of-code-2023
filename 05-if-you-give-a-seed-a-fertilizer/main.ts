const input = await Bun.file('input.txt').text()

const [rawSeeds, ...rawMappingRangeGroups] = input.split('\n\n')

const seeds = rawSeeds.split(': ').at(-1)?.split(' ').map(Number) || []

const mappingRangeGroups = rawMappingRangeGroups.map(parseMappingRange)

const seedRanges = seeds.map<Range>((seed) => ({ start: seed, end: seed }))

const lowestStart = processRanges(seedRanges, mappingRangeGroups)

const seedRanges2 = seeds.flatMap<Range>((seed, seedIndex) => {
	return seedIndex % 2
		? []
		: [{ start: seed, end: seed + seeds[seedIndex + 1] - 1 }]
})

const lowestStart2 = processRanges(seedRanges2, mappingRangeGroups)

console.log(`Lowest location number: ${lowestStart}
Lowest location number adjusted: ${lowestStart2}`)

type Range = {
	start: number
	end: number
}

type MappingRange = Range & {
	offset: number
}

type MappingRangeResult = {
	mapped: Range[]
	nonMapped: Range[]
}

function processRanges(
	ranges: Range[],
	mappingGroups: MappingRange[][],
): number {
	for (const mappingRangeGroup of mappingRangeGroups) {
		let newRanges: Range[] = []
		for (const range of ranges) {
			let nonMappedRanges = [range]
			let mappedRanges: Range[] = []
			for (const mappingRange of mappingRangeGroup) {
				for (const nonMappedRange of nonMappedRanges) {
					const result = mapRange(nonMappedRange, mappingRange)
					mappedRanges = mappedRanges.concat(result.mapped)
					nonMappedRanges = result.nonMapped
				}
			}
			newRanges = newRanges.concat(mappedRanges.concat(nonMappedRanges))
		}
		ranges = newRanges
	}
	return ranges.reduce(
		(lowestStart, range) => Math.min(lowestStart, range.start),
		Infinity,
	)
}

function mapRange(r: Range, mr: MappingRange): MappingRangeResult {
	const maxStart = Math.max(r.start, mr.start)
	const minEnd = Math.min(r.end, mr.end)
	const result: MappingRangeResult = {
		mapped: [],
		nonMapped: [],
	}
	if (maxStart > minEnd) {
		result.nonMapped.push(r)
		return result
	}
	result.mapped.push({
		start: maxStart + mr.offset,
		end: minEnd + mr.offset,
	})
	if (r.start < mr.start) {
		result.nonMapped.push({
			start: r.start,
			end: mr.start - 1,
		})
	}
	if (r.end > mr.end) {
		result.nonMapped.push({
			start: mr.end + 1,
			end: r.end,
		})
	}
	return result
}

function parseMappingRange(rawMap: string): MappingRange[] {
	const [_, ...rawEntries] = rawMap.split('\n')
	return rawEntries.map((rawEntry) => {
		const [destStart, sourceStart, length] = rawEntry.split(' ').map(Number)
		return {
			start: sourceStart,
			end: sourceStart + length - 1,
			offset: destStart - sourceStart,
		}
	})
}
