const input = await Bun.file('input.txt').text()

const galaxies = parseGalaxies(input)

const distanceSum = calculateDistanceSum(galaxies, 2)

const distanceSum2 = calculateDistanceSum(galaxies, 1000000)

console.log(`Sum of distances: ${distanceSum}
Sum of distances adjusted: ${distanceSum2}`)

type Galaxy = { x: number; y: number }

function calculateDistanceSum(
	galaxies: Galaxy[],
	spaceMultiplier: number,
): number {
	const xSpreadGalaxies = spreadGalaxiesBy(
		structuredClone(galaxies),
		'x',
		spaceMultiplier,
	)
	const spreadGalaxies = spreadGalaxiesBy(xSpreadGalaxies, 'y', spaceMultiplier)
	const pairs = getGalaxyPairs(spreadGalaxies)
	const distances = pairs.map((p) => distance(p.start, p.end))
	return distances.reduce((sum, distance) => sum + distance)
}

function parseGalaxies(rawGalaxies: string): Galaxy[] {
	const rows = rawGalaxies.split('\n')
	const galaxies: Galaxy[] = []
	for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
		for (let columnIndex = 0; columnIndex < rows[0].length; columnIndex++) {
			if (rows[rowIndex][columnIndex] === '#') {
				galaxies.push({
					x: columnIndex,
					y: rowIndex,
				})
			}
		}
	}
	return galaxies
}

function spreadGalaxiesBy(
	galaxies: Galaxy[],
	axis: keyof Galaxy,
	spaceMultiplier: number,
): Galaxy[] {
	const sortedGalaxies = galaxies.toSorted((g1, g2) => g1[axis] - g2[axis])

	let lastAxis = sortedGalaxies[0][axis]
	let totalSpaceCount = 0
	for (
		let galaxyIndex = 1;
		galaxyIndex < sortedGalaxies.length;
		galaxyIndex++
	) {
		const galaxy = sortedGalaxies[galaxyIndex]
		const spaceCount = galaxy[axis] - lastAxis - 1
		if (spaceCount > 0) {
			totalSpaceCount += spaceCount * spaceMultiplier - 1
		}
		lastAxis = galaxy[axis]
		galaxy[axis] += totalSpaceCount
	}

	return sortedGalaxies
}

function getGalaxyPairs(galaxies: Galaxy[]): { start: Galaxy; end: Galaxy }[] {
	const pairs = new Set<string>()
	for (const g1 of galaxies) {
		for (const g2 of galaxies) {
			if (g1.x === g2.x && g1.y === g2.y) {
				continue
			}
			pairs.add(
				[g1, g2]
					.map((g) => `${g.x}:${g.y}`)
					.toSorted()
					.join('-'),
			)
		}
	}
	return Array.from(pairs, (pair) => {
		const [start, end] = pair.split('-')
		const [startX, startY] = start.split(':').map(Number)
		const [endX, endY] = end.split(':').map(Number)
		return {
			start: { x: startX, y: startY },
			end: { x: endX, y: endY },
		}
	})
}

function distance(g1: Galaxy, g2: Galaxy): number {
	return Math.abs(g1.x - g2.x) + Math.abs(g1.y - g2.y)
}
