const input = await Bun.file('input.txt').text()

const universe = parseUniverse(input)

expand(universe)

const galaxies = getGalaxies(universe)

const galaxyPairs = getGalaxyPairs(galaxies)

const distances = galaxyPairs.map((pair) => distance(pair.start, pair.end))

const distanceSum = distances.reduce((sum, distance) => sum + distance)

console.log(`Sum of distances: ${distanceSum}`)

function parseUniverse(rawUniverse: string): string[][] {
	return rawUniverse.split('\n').map((row) => row.split(''))
}

type Point = { x: number; y: number }

type Pair = { start: Point; end: Point }

function getGalaxies(universe: string[][]): Point[] {
	const points: Point[] = []
	for (let rowIndex = 0; rowIndex < universe.length; rowIndex++) {
		for (let columnIndex = 0; columnIndex < universe[0].length; columnIndex++) {
			if (universe[rowIndex][columnIndex] === '#') {
				points.push({
					x: columnIndex,
					y: rowIndex,
				})
			}
		}
	}
	return points
}

function getGalaxyPairs(galaxies: Point[]): Pair[] {
	const serialisedPairs = new Set<string>()
	for (const mainGalaxy of galaxies) {
		for (const secondaryGalaxy of galaxies) {
			if (
				mainGalaxy.x === secondaryGalaxy.x &&
				mainGalaxy.y === secondaryGalaxy.y
			) {
				continue
			}
			serialisedPairs.add(
				[mainGalaxy, secondaryGalaxy]
					.map((point) => `${point.x}:${point.y}`)
					.toSorted()
					.join('-'),
			)
		}
	}
	return Array.from(serialisedPairs, (serialisedPair) => {
		const [start, end] = serialisedPair.split('-')
		const [startX, startY] = start.split(':').map(Number)
		const [endX, endY] = end.split(':').map(Number)
		return {
			start: { x: startX, y: startY },
			end: { x: endX, y: endY },
		}
	})
}

function expand(universe: string[][]): void {
	getSpaceIndexes(universe, isRowSpace).forEach((spaceIndex, rowIndex) => {
		universe.splice(
			spaceIndex + rowIndex,
			0,
			universe[0].map(() => '.'),
		)
	})
	getSpaceIndexes(universe, isColumnSpace).forEach(
		(spaceIndex, columnIndex) => {
			universe.forEach((_, rowIndex) => {
				universe[rowIndex].splice(spaceIndex + columnIndex, 0, '.')
			})
		},
	)
}

function getSpaceIndexes(
	entities: unknown[],
	filterFunc: (u: string[][], i: number) => boolean,
): number[] {
	return entities
		.map((_, entityIndex) => entityIndex)
		.filter((entityIndex) => filterFunc(universe, entityIndex))
}

function isRowSpace(universe: string[][], rowIndex: number): boolean {
	return areEntitiesSpace(universe[rowIndex])
}

function isColumnSpace(universe: string[][], columnIndex: number): boolean {
	return areEntitiesSpace(universe.map((row) => row[columnIndex]))
}

function areEntitiesSpace(entities: string[]): boolean {
	return entities.every((entity) => entity === '.')
}

function distance(point1: Point, point2: Point): number {
	return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y)
}
