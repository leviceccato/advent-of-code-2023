const input = await Bun.file('input.txt').text()

const springRecords = input.split('\n').map(parseSpringRecord)

type SpringCondition = 'operational' | 'damaged' | 'unknown'

type SpringRecord = {
	damagedGroups: number[]
	conditions: SpringCondition[]
}

function parseSpringRecord(rawSpringRecord: string): SpringRecord {
	const [rawConditions, rawDamagedGroups] = rawSpringRecord.split(' ')
	return {
		damagedGroups: rawDamagedGroups.split(',').map(Number),
		conditions: rawConditions.split('').map((rawCondition) => {
			switch (rawCondition) {
				case '.':
					return 'operational'
				case '#':
					return 'damaged'
				default:
					return 'unknown'
			}
		}),
	}
}

function getConditionCombinations(
	springRecord: SpringRecord,
): SpringCondition[][] {
	const unknownGroupIndexes: number[] = []
	springRecord.conditions.forEach((condition, conditionIndex) => {
		if (condition === 'unknown') {
			unknownGroupIndexes.push(conditionIndex)
		}
	})
}
