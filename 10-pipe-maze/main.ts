const input = await Bun.file('input.txt').text()

const directionToTileMap: Record<string, string> = {
	'bottom-top': '|',
	'left-right': '-',
	'right-top': 'L',
	'left-top': 'J',
	'bottom-left': '7',
	'bottom-right': 'F',
}

const tileToDirectionMap = Object.fromEntries(
	Object.entries(directionToTileMap).map(([k, v]) => [v, k.split('-')]),
)

const grid = parseGrid(input)

const farthestPointStepCount = grid.loop.size / 2

const innerTileCount = getInnerTileIndexes(grid).length

console.log(`Steps to get to farthest point: ${farthestPointStepCount}
Inner tile count: ${innerTileCount}`)

type Grid = {
	tiles: string[]
	width: number
	startIndex: number
	loop: Set<number>
}

function parseGrid(rawGrid: string): Grid {
	const tiles = rawGrid.split('')
	const grid = {
		tiles,
		width: 1 + tiles.findIndex((tile) => tile === '\n'),
		startIndex: tiles.findIndex((tile) => tile === 'S'),
		loop: new Set<number>(),
	}

	let index: number | undefined = grid.startIndex
	while (index !== undefined) {
		grid.loop.add(index)
		index = getAdjoiningTileIndexes(grid, index).find(
			(adjoiningIndex) => !grid.loop.has(adjoiningIndex),
		)
	}

	const loop = Array.from(grid.loop)
	const startDirections = Object.entries(
		getAdjacentIndexes(grid.width, grid.startIndex),
	)
		.filter(
			([_, index]) => index === loop[1] || index === loop[loop.length - 1],
		)
		.map(([direction]) => direction)
		.toSorted()
		.join('-')

	grid.tiles[grid.startIndex] = directionToTileMap[startDirections] || 'S'

	return grid
}

function getAdjacentIndexes(
	gridWidth: number,
	index: number,
): Record<string, number> {
	return {
		top: index - gridWidth,
		right: index + 1,
		bottom: index + gridWidth,
		left: index - 1,
	}
}

function getAdjoiningTileIndexes(grid: Grid, index: number): number[] {
	const indexes = getAdjacentIndexes(grid.width, index)

	const tile = grid.tiles[index]
	if (tile === 'S') {
		return Object.values(indexes).filter((adjacentIndex) => {
			return getAdjoiningTileIndexes(grid, adjacentIndex).includes(index)
		})
	}

	return (
		tileToDirectionMap[tile]?.map((rawDirection) => indexes[rawDirection]) || []
	)
}

function getInnerTileIndexes(grid: Grid): number[] {
	const indexes: number[] = []
	for (let tileIndex = 0; tileIndex < grid.tiles.length; tileIndex++) {
		if (grid.loop.has(tileIndex)) {
			continue
		}

		let isInside = false
		let rowIndex = tileIndex
		let tile = grid.tiles[rowIndex]
		while (tile !== '\n' && tile !== undefined) {
			if (
				grid.loop.has(rowIndex) &&
				(tile === '|' || tile === 'L' || tile === 'J')
			) {
				isInside = !isInside
			}
			tile = grid.tiles[++rowIndex]
		}

		if (isInside) {
			indexes.push(tileIndex)
		}
	}
	return indexes
}
