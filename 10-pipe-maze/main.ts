const input = await Bun.file('input.txt').text()

const grid = parseGrid(input)

const loop = getLoop(grid)

const farthestPointStepCount = loop.length / 2

console.log(`Steps to get to farthest point: ${farthestPointStepCount}`)

type Grid = {
	tiles: string[]
	width: number
	start: number
}

function parseGrid(rawGrid: string): Grid {
	const tiles = rawGrid.split('')
	return {
		tiles,
		width: 1 + tiles.findIndex((tile) => tile === '\n'),
		start: tiles.findIndex((tile) => tile === 'S'),
	}
}

function getAdjoiningTileIndexes(grid: Grid, index: number): number[] {
	const top = index - grid.width
	const bottom = index + grid.width
	const left = index - 1
	const right = index + 1

	switch (grid.tiles[index]) {
		case '|':
			return [top, bottom]
		case '-':
			return [left, right]
		case 'L':
			return [top, right]
		case 'J':
			return [left, top]
		case '7':
			return [left, bottom]
		case 'F':
			return [right, bottom]
		case 'S':
			const adjoiningIndexes: number[] = []
			;[top, right, bottom, left].forEach((adjacentIndex) => {
				if (getAdjoiningTileIndexes(grid, adjacentIndex).includes(index)) {
					adjoiningIndexes.push(adjacentIndex)
				}
			})
			return adjoiningIndexes
		default:
			return []
	}
}

function getLoop(grid: Grid): number[] {
	const indexes = new Set<number>()
	let lastIndex: number | undefined = grid.start

	while (lastIndex !== undefined) {
		indexes.add(lastIndex)
		lastIndex = getAdjoiningTileIndexes(grid, lastIndex).find(
			(adjoiningIndex) => !indexes.has(adjoiningIndex),
		)
	}

	return Array.from(indexes)
}
